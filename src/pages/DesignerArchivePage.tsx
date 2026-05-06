import { useEffect, useRef, useState } from 'react'
import {
  designerNodeBatchSize,
  designerPoolNodes,
  designerSeedNodes,
  initialDesignerVisibleCount,
  pickDesignerAsset,
  hashValue,
} from '../data'
import type { DesignerAsset, DesignerProfile, DesignerSection } from '../types'

type DesignerArchivePageProps = {
  onBackToDesign: () => void
  onOpenDetail: () => void
}

function DesignerArchivePage({ onBackToDesign, onOpenDetail }: DesignerArchivePageProps) {
  const [activeDesigner, setActiveDesigner] = useState<DesignerProfile>(designerSeedNodes[0])
  const [loadedDesignerCount, setLoadedDesignerCount] = useState(
    Math.min(designerPoolNodes.length, Math.max(0, initialDesignerVisibleCount - designerSeedNodes.length)),
  )
  const [phaseCount, setPhaseCount] = useState(1)
  const [sections, setSections] = useState<DesignerSection[]>([])
  const [isFetching, setIsFetching] = useState(true)
  const [scrollProgress, setScrollProgress] = useState(0)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const triggerRef = useRef<HTMLDivElement | null>(null)
  const phaseCursorRef = useRef(0)
  const fetchTimerRef = useRef<number | null>(null)
  const isFetchingRef = useRef(false)
  const visibleDesigners = [...designerSeedNodes, ...designerPoolNodes.slice(0, loadedDesignerCount)]

  const appendPhaseSection = (designer: DesignerProfile) => {
    const nextPhase = phaseCursorRef.current + 1
    phaseCursorRef.current = nextPhase
    const patternIndex = (nextPhase - 1) % 3
    let pattern: DesignerSection['pattern'] = 'split'
    let assets: DesignerAsset[] = [pickDesignerAsset(designer.id, nextPhase, 0), pickDesignerAsset(designer.id, nextPhase, 1)]

    if (patternIndex === 1) {
      pattern = 'triple'
      assets = [
        pickDesignerAsset(designer.id, nextPhase, 2),
        pickDesignerAsset(designer.id, nextPhase, 3),
        pickDesignerAsset(designer.id, nextPhase, 4),
      ]
    } else if (patternIndex === 2) {
      pattern = 'hero'
      assets = [pickDesignerAsset(designer.id, nextPhase, 5)]
    }

    const serial = (hashValue(`${designer.id}-${nextPhase}`) % 9000) + 1000
    setSections((prev) => [...prev, { id: `${designer.id}-${nextPhase}`, pattern, assets, serial }])
    setPhaseCount(nextPhase)
  }

  const queuePhaseLoad = (designer: DesignerProfile, delay = 420) => {
    if (fetchTimerRef.current !== null) {
      window.clearTimeout(fetchTimerRef.current)
    }
    isFetchingRef.current = true
    setIsFetching(true)
    fetchTimerRef.current = window.setTimeout(() => {
      appendPhaseSection(designer)
      isFetchingRef.current = false
      setIsFetching(false)
    }, delay)
  }

  useEffect(() => {
    setSections([])
    setPhaseCount(1)
    phaseCursorRef.current = 0
    queuePhaseLoad(activeDesigner, 520)
    window.scrollTo(0, 0)
    return () => {
      if (fetchTimerRef.current !== null) {
        window.clearTimeout(fetchTimerRef.current)
      }
    }
  }, [activeDesigner])

  useEffect(() => {
    const node = triggerRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0]
        if (!firstEntry?.isIntersecting || isFetchingRef.current) return
        queuePhaseLoad(activeDesigner, 460)
      },
      { threshold: 0.2 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [activeDesigner])

  useEffect(() => {
    const onWindowScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const nextProgress = maxScroll > 0 ? Math.min(100, Math.max(0, (window.scrollY / maxScroll) * 100)) : 0
      setScrollProgress(nextProgress)
    }
    onWindowScroll()
    window.addEventListener('scroll', onWindowScroll, { passive: true })
    return () => window.removeEventListener('scroll', onWindowScroll)
  }, [])

  const loadMoreDesignerNodes = () => {
    setLoadedDesignerCount((prev) => Math.min(designerPoolNodes.length, prev + designerNodeBatchSize))
  }

  const handleTrackScroll = () => {
    const track = trackRef.current
    if (!track) return
    if (track.scrollLeft + track.clientWidth < track.scrollWidth - 50) return
    loadMoreDesignerNodes()
  }

  const handleSwitchDesigner = (designer: DesignerProfile, index: number) => {
    const isLastVisible = index === visibleDesigners.length - 1
    const hasMoreDesigners = loadedDesignerCount < designerPoolNodes.length
    if (isLastVisible && hasMoreDesigners) {
      loadMoreDesignerNodes()
      window.setTimeout(() => {
        const track = trackRef.current
        if (!track) return
        track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' })
      }, 40)
    }
    if (designer.id === activeDesigner.id) return
    setActiveDesigner(designer)
  }

  const handleOpenDetail = () => {
    onOpenDetail()
  }

  return (
    <div className="designer-page grid-bg">
      <div className="designer-watermark designer-watermark-top">ARCHIVE</div>
      <div className="designer-watermark designer-watermark-bottom">ENGINE</div>

      <div className="designer-side-index">
        <div className="designer-side-label">Phase_Scroll</div>
        <div className="designer-side-line">
          <div className="designer-side-indicator" style={{ height: `${Math.max(10, scrollProgress)}%` }} />
        </div>
        <div className="designer-side-phase">{phaseCount.toString().padStart(2, '0')}</div>
      </div>

      <div className="designer-topbar">
        <div className="designer-topbar-inner">
          <div className="designer-brand">
            <span className="designer-brand-dot" />
            <button type="button" className="designer-brand-text" onClick={onBackToDesign}>
              DAWANG.
            </button>
          </div>
          <div className="designer-brand-divider" />
          <div ref={trackRef} className="designer-track no-scrollbar" onScroll={handleTrackScroll}>
            {visibleDesigners.map((designer, index) => (
              <button
                key={designer.id}
                type="button"
                className={`designer-node ${activeDesigner.id === designer.id ? 'active' : ''}`}
                onClick={() => handleSwitchDesigner(designer, index)}
              >
                <span>{designer.displayName}</span>
                <small>Node: {designer.node}</small>
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="designer-main">
        <header className="designer-header">
          <div className="designer-header-left">
            <div className="designer-access-label">Node_Access: {activeDesigner.displayName}</div>
            <h1>
              {activeDesigner.title}
              <br />
              <span>ARCHIVES.</span>
            </h1>
          </div>
          <div className="designer-header-right">
            <p>Designer Signature:</p>
            <h3>DESIGN ETHOS</h3>
            <h4>{activeDesigner.streamNote}</h4>
          </div>
        </header>

        <div className="designer-exhibit-flow">
          {sections.map((section) => (
            <div key={section.id} className="designer-section">
              {section.pattern === 'split' ? (
                <div className="designer-row">
                  <article
                    className="designer-case designer-case-large"
                    role="button"
                    tabIndex={0}
                    onClick={handleOpenDetail}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        handleOpenDetail()
                      }
                    }}
                  >
                    <img src={section.assets[0].image} alt={`${section.assets[0].title}-large`} className="designer-case-image" />
                    <div className="designer-case-meta">
                      <div className="engine">{section.assets[0].engine}</div>
                      <h3>Genesis Node</h3>
                    </div>
                    <div className="designer-loading-bar" />
                  </article>
                  <article
                    className="designer-case designer-case-right"
                    role="button"
                    tabIndex={0}
                    onClick={handleOpenDetail}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        handleOpenDetail()
                      }
                    }}
                  >
                    <img src={section.assets[1].image} alt={`${section.assets[1].title}-right`} className="designer-case-image grayscale" />
                    <div className="designer-case-meta-right">
                      <div>
                        <p>Archive_Ref</p>
                        <h4>{section.assets[1].title}</h4>
                      </div>
                      <span>#{section.serial}</span>
                    </div>
                    <div className="designer-loading-bar" />
                  </article>
                </div>
              ) : null}

              {section.pattern === 'triple' ? (
                <div className="designer-row designer-row-three">
                  {section.assets.map((asset, idx) => (
                    <article
                      key={`${section.id}-${asset.title}`}
                      className="designer-case designer-case-square"
                      role="button"
                      tabIndex={0}
                      onClick={handleOpenDetail}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault()
                          handleOpenDetail()
                        }
                      }}
                    >
                      <img src={asset.image} alt={`${asset.title}-${idx + 1}`} className="designer-case-image" />
                      <div className="designer-case-square-meta">
                        <span>ID_{section.serial + idx}</span>
                        <span>{asset.title}</span>
                      </div>
                      <div className="designer-loading-bar" />
                    </article>
                  ))}
                </div>
              ) : null}

              {section.pattern === 'hero' ? (
                <div className="designer-row designer-row-hero">
                  <article
                    className="designer-case designer-case-hero"
                    role="button"
                    tabIndex={0}
                    onClick={handleOpenDetail}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        handleOpenDetail()
                      }
                    }}
                  >
                    <div className="designer-case-hero-meta">
                      <span>Archive Prototype // 2026</span>
                      <h3>{section.assets[0].title}</h3>
                      <p>由 {section.assets[0].engine} 引擎生成的拓扑版本。</p>
                    </div>
                    <img src={section.assets[0].image} alt={`${section.assets[0].title}-hero`} className="designer-case-hero-image" />
                    <div className="designer-loading-bar" />
                  </article>
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <div ref={triggerRef} className="designer-scroll-trigger">
          <div className="designer-trigger-line" />
          <span>Fetching_Cloud_Assets</span>
          <div className="designer-trigger-tip">{isFetching ? '同步設計師數據庫中...' : '滚动继续加载设计档案'}</div>
        </div>
      </main>
    </div>
  )
}

export default DesignerArchivePage
