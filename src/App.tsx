import { useEffect, useState } from 'react'
import AuthModal from './components/AuthModal'
import NavBar from './components/NavBar'
import DesignerArchivePage from './pages/DesignerArchivePage'
import DesignPage from './pages/DesignPage'
import DetailPage from './pages/DetailPage'
import DiscoverPage from './pages/DiscoverPage'
import FactoryPage from './pages/FactoryPage'
import MyPage from './pages/MyPage'
import WorkshopPage from './pages/WorkshopPage'
import type { AuthTab, Page } from './types'

function App() {
  const [page, setPage] = useState<Page>('discover')
  const [detailBackPage, setDetailBackPage] = useState<'discover' | 'design' | 'designer'>('discover')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authTab, setAuthTab] = useState<AuthTab>('login')
  const [isAuthConnecting, setIsAuthConnecting] = useState(false)

  useEffect(() => {
    document.body.classList.toggle('workshop-active', page === 'workshop')
    document.body.classList.toggle('factory-active', page === 'factory')
    document.body.classList.toggle('detail-active', page === 'detail')
    document.body.classList.toggle('designer-active', page === 'designer')
    window.scrollTo(0, 0)
    return () => {
      document.body.classList.remove('workshop-active')
      document.body.classList.remove('factory-active')
      document.body.classList.remove('detail-active')
      document.body.classList.remove('designer-active')
    }
  }, [page])

  useEffect(() => {
    document.body.classList.toggle('auth-modal-active', authModalOpen)
    return () => document.body.classList.remove('auth-modal-active')
  }, [authModalOpen])

  const handleMyClick = () => {
    if (isLoggedIn) {
      setPage('my')
      return
    }
    setAuthModalOpen(true)
  }

  const handleSimulateLogin = () => {
    setIsAuthConnecting(true)
    window.setTimeout(() => {
      setIsLoggedIn(true)
      setAuthModalOpen(false)
      setIsAuthConnecting(false)
      setPage('my')
    }, 600)
  }

  const openDetailFrom = (fromPage: 'discover' | 'design' | 'designer') => {
    setDetailBackPage(fromPage)
    setPage('detail')
  }

  return (
    <>
      {page !== 'detail' && page !== 'designer' ? (
        <NavBar page={page} isLoggedIn={isLoggedIn} onNavigate={setPage} onMyClick={handleMyClick} />
      ) : null}

      {page === 'discover' ? (
        <DiscoverPage onStartEngine={() => setPage('workshop')} onNavigate={setPage} onOpenDetail={() => openDetailFrom('discover')} />
      ) : null}
      {page === 'design' ? <DesignPage onOpenDetail={() => openDetailFrom('design')} onOpenDesigner={() => setPage('designer')} /> : null}
      {page === 'workshop' ? <WorkshopPage /> : null}
      {page === 'factory' ? <FactoryPage /> : null}
      {page === 'my' && isLoggedIn ? <MyPage onNavigateFactory={() => setPage('factory')} /> : null}
      {page === 'detail' ? <DetailPage onBack={() => setPage(detailBackPage)} /> : null}
      {page === 'designer' ? <DesignerArchivePage onBackToDesign={() => setPage('design')} onOpenDetail={() => openDetailFrom('designer')} /> : null}

      <AuthModal
        open={authModalOpen}
        authTab={authTab}
        isAuthConnecting={isAuthConnecting}
        onClose={() => setAuthModalOpen(false)}
        onTabChange={setAuthTab}
        onSimulateLogin={handleSimulateLogin}
      />
    </>
  )
}

export default App
