import type { Page } from '../types'

type NavBarProps = {
  page: Page
  isLoggedIn: boolean
  onNavigate: (page: Page) => void
  onMyClick: () => void
}

const navItems = [
  { key: 'discover', label: '发现', target: 'discover' as const },
  { key: 'design', label: '设计集', target: 'design' as const },
  { key: 'workshop', label: '创作坊', target: 'workshop' as const },
  { key: 'factory', label: '生产间', target: 'factory' as const },
]

function NavBar({ page, isLoggedIn, onNavigate, onMyClick }: NavBarProps) {
  return (
    <div className="nav-shell">
      <header className="nav-bar">
        <div className="nav-logo">DAWANG</div>
        <nav className="nav-links" aria-label="primary">
          {navItems.map((item) => (
            <button
              key={item.key}
              type="button"
              className={item.target === page ? 'active' : ''}
              onClick={() => {
                if (item.target) {
                  onNavigate(item.target)
                }
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="nav-right">
          <a
            href="#"
            className={page === 'my' && isLoggedIn ? 'active' : ''}
            onClick={(event) => {
              event.preventDefault()
              onMyClick()
            }}
          >
            我的
          </a>
        </div>
      </header>
    </div>
  )
}

export default NavBar
