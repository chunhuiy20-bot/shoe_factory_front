import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { designGalleryImages } from '../data'

type DetailPageProps = {
  onBack: () => void
}

function DetailPage({ onBack }: DetailPageProps) {
  const threeContainerRef = useRef<HTMLDivElement | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [previewScale, setPreviewScale] = useState(1)

  useEffect(() => {
    const container = threeContainerRef.current
    if (!container) return

    let frameId = 0
    let controls: OrbitControls | null = null
    let renderer: THREE.WebGLRenderer | null = null
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.01, 100)
    camera.position.set(0.6, 0.4, 1.2)

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    container.appendChild(renderer.domElement)

    scene.add(new THREE.AmbientLight(0xffffff, 1.2))
    const pointLight = new THREE.PointLight(0xffffff, 8)
    pointLight.position.set(2, 2, 2)
    scene.add(pointLight)

    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.5

    const loader = new GLTFLoader()
    loader.load(
      'https://threejs.org/examples/models/gltf/MaterialsVariantsShoe/glTF/MaterialsVariantsShoe.gltf',
      (gltf) => {
        const model = gltf.scene
        const box = new THREE.Box3().setFromObject(model)
        const center = box.getCenter(new THREE.Vector3())
        model.position.sub(center)
        scene.add(model)
      },
      undefined,
      () => {
        // keep empty visual if model stream fails
      },
    )

    const handleResize = () => {
      if (!renderer) return
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }

    const animate = () => {
      frameId = window.requestAnimationFrame(animate)
      controls?.update()
      renderer?.render(scene, camera)
    }

    window.addEventListener('resize', handleResize)
    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.cancelAnimationFrame(frameId)
      controls?.dispose()
      renderer?.dispose()
      while (container.firstChild) {
        container.removeChild(container.firstChild)
      }
    }
  }, [])

  useEffect(() => {
    if (!previewImage) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setPreviewImage(null)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [previewImage])

  return (
    <div className="detail-overlay">
      <div className="detail-shell">
        <div className="detail-main-view grid-bg">
          <button type="button" className="detail-back-btn" onClick={onBack}>
            <span className="detail-back-icon">←</span>
            BACK TO ARCHIVES
          </button>

          <div className="detail-viewport-placeholder">
            <div ref={threeContainerRef} className="detail-three-container" />
            <div className="detail-scan-line" />
            <div className="detail-code-block">
              [ VIEW_MODE: 3D_INTERACTIVE ]
              <br />
              [ ENGINE: RENDER_NATIVE_V3 ]
            </div>
          </div>

          <div className="detail-corner detail-corner-tl" />
          <div className="detail-corner detail-corner-tr" />
          <div className="detail-corner detail-corner-bl" />
          <div className="detail-corner detail-corner-br" />
        </div>

        <aside className="detail-side-panel custom-scrollbar">
          <div className="detail-scroll-body">
            <section className="detail-head">
              <div className="detail-head-top">
                <span className="detail-chip">ENGINE: GENESIS_V3</span>
                <span className="detail-node-id">#9,204-A</span>
              </div>
              <h1>Aero-Strata 01</h1>
              <p>基于气动动力学重构的拓扑优化原型。通过 AI 自主推演，在保持结构强度的前提下将重量降低了 35%。</p>
            </section>

            <section className="detail-designer">
              <div className="detail-designer-avatar">KY</div>
              <div>
                <p>Designed By</p>
                <h4>K. Yamamoto / Studio</h4>
              </div>
            </section>

            <section className="detail-gallery no-scrollbar">
              {designGalleryImages.slice(0, 4).map((img, idx) => (
                <button
                  key={img}
                  type="button"
                  className="detail-thumb"
                  onClick={() => {
                    setPreviewImage(img)
                    setPreviewScale(1)
                  }}
                >
                  <img src={img} alt={`detail-${idx + 1}`} />
                </button>
              ))}
            </section>

            <section className="detail-metrics">
              <div>
                <p>Weight / 重量</p>
                <h3>215 G</h3>
              </div>
              <div>
                <p>Gen_Time / 耗时</p>
                <h3>14.2 S</h3>
              </div>
              <div>
                <p>Material / 材质</p>
                <h5>Carbon Fiber</h5>
              </div>
              <div>
                <p>Status / 状态</p>
                <h5>
                  <span className="detail-ready-dot" />
                  READY TO PRINT
                </h5>
              </div>
            </section>
          </div>

          <footer className="detail-footer">
            <button type="button" className="btn-fill-effect detail-primary-btn">
              <span>立即下单生产 / Order Production</span>
            </button>
            <button type="button" className="detail-secondary-btn">
              获取 3D 原型文件 / Download Assets
            </button>
          </footer>
        </aside>
      </div>

      {previewImage ? (
        <div className="detail-image-modal" role="dialog" aria-modal="true">
          <button type="button" className="detail-image-modal-bg" onClick={() => setPreviewImage(null)} aria-label="Close preview background" />
          <div className="detail-image-modal-panel">
            <div className="detail-image-modal-toolbar">
              <button
                type="button"
                className="detail-zoom-btn"
                onClick={() => setPreviewScale((prev) => Math.max(0.6, Number((prev - 0.2).toFixed(2))))}
              >
                -
              </button>
              <span className="detail-zoom-label">{Math.round(previewScale * 100)}%</span>
              <button
                type="button"
                className="detail-zoom-btn"
                onClick={() => setPreviewScale((prev) => Math.min(3, Number((prev + 0.2).toFixed(2))))}
              >
                +
              </button>
              <button type="button" className="detail-image-close-btn" onClick={() => setPreviewImage(null)}>
                ✕
              </button>
            </div>

            <div className="detail-image-modal-canvas">
              <img src={previewImage} alt="zoom-preview" style={{ transform: `scale(${previewScale})` }} />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default DetailPage
