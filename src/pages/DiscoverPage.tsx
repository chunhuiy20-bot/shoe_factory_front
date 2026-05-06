import SiteFooter from '../components/SiteFooter'
import { discoverHeroImage, discoverProjects } from '../data'
import type { Page } from '../types'

type DiscoverPageProps = {
  onStartEngine: () => void
  onNavigate: (page: Page) => void
  onOpenDetail: () => void
}

function DiscoverPage({ onStartEngine, onNavigate, onOpenDetail }: DiscoverPageProps) {
  return (
    <>
      <div className="bg-shape shape1" />

      <section className="hero-container">
        <div className="hero-slogan-wrapper">
          <h1 className="hero-slogan">
            DESIGN THE <span className="highlight">UNSEEN.</span>
          </h1>
        </div>

        <div className="hero-text-block">
          <h2 className="hero-kicker">接入 DAWANG 工业互联引擎</h2>
          <div className="hero-description-stack">
            <p>上传思维碎片，AI 即刻重构物理鞋身，</p>
            <p>72小时内数字孪生至物理现实。</p>
          </div>
        </div>

        <div className="hero-visual-wrapper">
          <div className="hero-visual-placeholder">
            <div
              className="hero-visual-image"
              style={{
                backgroundImage: `url(${discoverHeroImage})`,
              }}
            />
            <div className="crosshair tl" />
            <div className="crosshair tr" />
            <div className="crosshair bl" />
            <div className="crosshair br" />
            <div className="hero-scan-line" />
            <span className="cad-text">[ RENDER_VIEWPORT ]</span>
            <a
              href="#"
              className="hero-action hero-action-floating"
              onClick={(event) => {
                event.preventDefault()
                onStartEngine()
              }}
            >
              <span>前往创作</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      <section className="editorial-section">
        <header className="section-header">
          <h2 className="section-title">Master Archive.</h2>
          <span className="section-meta">COLLECTION 01</span>
        </header>

        {discoverProjects.map((project) => (
          <article key={project.id} className="project-block">
            <div
              className="project-visual"
              style={{
                backgroundImage: `url(${project.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <span className="placeholder-stamp">{project.stamp}</span>
            </div>
            <div className="project-info">
              <span className="project-number">{project.id} //</span>
              <h3 className="project-name">{project.name}</h3>
              <span className="project-designer">{project.designer}</span>
              <p className="project-desc">{project.desc}</p>
              <a
                href="#"
                className="btn-explore"
                onClick={(event) => {
                  event.preventDefault()
                  onOpenDetail()
                }}
              >
                Explore Model
              </a>
            </div>
          </article>
        ))}
      </section>

      <SiteFooter onNavigate={onNavigate} />
    </>
  )
}

export default DiscoverPage
