import type { Page } from '../types'

type SiteFooterProps = {
  onNavigate: (page: Page) => void
}

function SiteFooter({ onNavigate }: SiteFooterProps) {
  return (
    <footer className="site-footer">
      <div className="site-footer-scanline">
        <div className="site-footer-scanbar" />
      </div>

      <div className="site-footer-inner">
        <div className="site-footer-grid">
          <div className="site-footer-brand-col">
            <div>
              <div className="site-footer-logo">DAWANG.</div>
              <p className="site-footer-desc">
                Scaling visions into physical reality via AI.
                <br />
                The Genesis of DTC manufacturing.
              </p>
            </div>
            <div className="site-footer-socials">
              <a href="#">INSTAGRAM</a>
              <a href="#">TWITTER</a>
              <a href="#">BEHANCE</a>
            </div>
          </div>

          <div className="site-footer-links-col">
            <div className="site-footer-col-title site-footer-col-title-blue">Explore</div>
            <ul>
              <li>
                <a
                  href="#"
                  onClick={(event) => {
                    event.preventDefault()
                    onNavigate('discover')
                  }}
                >
                  发现 / Discover
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(event) => {
                    event.preventDefault()
                    onNavigate('design')
                  }}
                >
                  设计集 / Archives
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(event) => {
                    event.preventDefault()
                    onNavigate('workshop')
                  }}
                >
                  创作坊 / Studio
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(event) => {
                    event.preventDefault()
                    onNavigate('factory')
                  }}
                >
                  生产间 / Factory
                </a>
              </li>
            </ul>
          </div>

          <div className="site-footer-links-col">
            <div className="site-footer-col-title">Protocols</div>
            <ul>
              <li>
                <a href="#">Terms of Service / 协议</a>
              </li>
              <li>
                <a href="#">Privacy Policy / 隐私</a>
              </li>
              <li>
                <a href="#">Contact / 联络：HQ@DAWANG.FACTORY</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default SiteFooter
