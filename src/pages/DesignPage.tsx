import { useEffect, useRef, useState } from 'react'
import { archiveCards, getDesignImage, spotlightCards } from '../data'
import type { ArchiveFilter } from '../types'

type DesignPageProps = {
  onOpenDetail: () => void
  onOpenDesigner: () => void
}

type SimulatedArchiveCard = (typeof archiveCards)[number] & {
  uid: string
  imageIndex: number
}

function DesignPage({ onOpenDetail, onOpenDesigner }: DesignPageProps) {
  const [activeFilter, setActiveFilter] = useState<ArchiveFilter>('all')
  const [visibleCount, setVisibleCount] = useState(9)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const loadTriggerRef = useRef<HTMLDivElement | null>(null)
  const loadTimerRef = useRef<number | null>(null)
  const baseFilteredCards = archiveCards.filter((card) => activeFilter === 'all' || card.category === activeFilter)
  const simulatedTotal = 60
  const simulatedCards: SimulatedArchiveCard[] = Array.from({ length: simulatedTotal }, (_, index) => {
    const base = baseFilteredCards[index % baseFilteredCards.length]
    const groupIndex = Math.floor(index / baseFilteredCards.length)
    return {
      ...base,
      uid: `${activeFilter}-${index}-${base.shoe}`,
      shoe: groupIndex > 0 ? `${base.shoe} ${String(groupIndex + 1).padStart(2, '0')}` : base.shoe,
      imageIndex: index + spotlightCards.length,
    }
  })
  const visibleCards = simulatedCards.slice(0, visibleCount)
  const canLoadMore = visibleCount < simulatedCards.length

  useEffect(() => {
    setVisibleCount(9)
    setIsLoadingMore(false)
    if (loadTimerRef.current !== null) {
      window.clearTimeout(loadTimerRef.current)
      loadTimerRef.current = null
    }
  }, [activeFilter])

  useEffect(() => {
    const node = loadTriggerRef.current
    if (!node || !canLoadMore) return
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (!first?.isIntersecting || isLoadingMore) return
        setIsLoadingMore(true)
        if (loadTimerRef.current !== null) {
          window.clearTimeout(loadTimerRef.current)
        }
        loadTimerRef.current = window.setTimeout(() => {
          setVisibleCount((prev) => Math.min(prev + 6, simulatedCards.length))
          setIsLoadingMore(false)
          loadTimerRef.current = null
        }, 500)
      },
      { threshold: 0.2 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [canLoadMore, isLoadingMore, simulatedCards.length])

  useEffect(() => {
    return () => {
      if (loadTimerRef.current !== null) {
        window.clearTimeout(loadTimerRef.current)
      }
    }
  }, [])

  return (
    <>
      <section className="spotlight-section">
        <div className="spotlight-header">
          <h2>Daily Spotlight.</h2>
          <span>[ FEATURED DESIGNER ]</span>
        </div>

        <div className="matrix-meta-header">
          <div className="meta-col">
            <span className="label">DESIGNER</span>
            <button type="button" className="designer-link-btn value" onClick={onOpenDesigner}>
              K. Yamamoto
            </button>
          </div>
          <div className="meta-col">
            <span className="label">CREATOR_TYPE</span>
            <span className="value">MASTER_TIER</span>
          </div>
          <div className="meta-col">
            <span className="label">TOTAL_DESIGNS</span>
            <span className="value blue">04 PROTOTYPES</span>
          </div>
          <div className="meta-col">
            <span className="label">STYLE_MATRIX</span>
            <span className="value desc">Aero-Strata 核心系列，极简流体力学。</span>
          </div>
        </div>

        <div className="blueprint-grid">
          {spotlightCards.map((card, index) => (
            <article
              key={card.key}
              className={`bp-card ${card.className}`}
              role="button"
              tabIndex={0}
              onClick={onOpenDetail}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onOpenDetail()
                }
              }}
              style={{
                backgroundImage: `url(${getDesignImage(index)})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {card.corners.includes('tl') ? <div className="bracket b-tl" /> : null}
              {card.corners.includes('tr') ? <div className="bracket b-tr" /> : null}
              {card.corners.includes('bl') ? <div className="bracket b-bl" /> : null}
              {card.corners.includes('br') ? <div className="bracket b-br" /> : null}

              <h3 className="bp-title">{card.title}</h3>
              <span className="bp-center-text">{card.center}</span>
              {card.tag ? <span className="bp-tag">{card.tag}</span> : null}
            </article>
          ))}
        </div>
      </section>

      <header className="archive-header-design">
        <h1 className="page-title">The Archive.</h1>

        <div className="filter-console">
          <div className="filter-tabs">
            <button type="button" className={`tab-item ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => setActiveFilter('all')}>
              全部档案 (9,204)
            </button>
            <button type="button" className={`tab-item ${activeFilter === 'studio' ? 'active' : ''}`} onClick={() => setActiveFilter('studio')}>
              官方发布 STUDIO
            </button>
            <button type="button" className={`tab-item ${activeFilter === 'community' ? 'active' : ''}`} onClick={() => setActiveFilter('community')}>
              用户共创 COMMUNITY
            </button>
          </div>

          <div className="search-box">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input type="text" placeholder="搜索鞋款 / 设计师..." />
          </div>
        </div>
      </header>

      <main className="archive-grid-design">
        {visibleCards.map((card) => (
          <article
            key={card.uid}
            className="data-card"
            onClick={onOpenDetail}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                onOpenDetail()
              }
            }}
          >
            <div className="card-header">
              <div className="creator-info">
                <div className="creator-avatar">
                  <img src={card.avatar} alt="avatar" />
                </div>
                <span className="creator-name">{card.creator}</span>
              </div>
              <span className={`badge ${card.badgeClass}`}>{card.badge}</span>
            </div>

            <div
              className="card-visual"
              style={{
                backgroundImage: `url(${getDesignImage(card.imageIndex)})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="floating-brand">DAWANG</div>
              <span className="render-code">{card.code}</span>
            </div>

            <div className="card-footer">
              <h3 className="shoe-name">{card.shoe}</h3>
              <div className="specs-grid">
                {card.specs.map((spec) => (
                  <div key={spec.label} className="spec-item">
                    <span className="label">{spec.label}</span>
                    <span className="val">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}

        {canLoadMore ? (
          <div ref={loadTriggerRef} className="archive-load-trigger">
            <div className="archive-load-line" />
            <span>{isLoadingMore ? 'SYNCING MORE ARCHIVES...' : 'SCROLL TO LOAD MORE'}</span>
          </div>
        ) : (
          <div className="archive-load-end">
            <div className="archive-load-line" />
            <span>END OF ARCHIVE STREAM</span>
          </div>
        )}
      </main>
    </>
  )
}

export default DesignPage
