import type { AuthTab } from '../types'

type AuthModalProps = {
  open: boolean
  authTab: AuthTab
  isAuthConnecting: boolean
  onClose: () => void
  onTabChange: (tab: AuthTab) => void
  onSimulateLogin: () => void
}

function AuthModal({ open, authTab, isAuthConnecting, onClose, onTabChange, onSimulateLogin }: AuthModalProps) {
  return (
    <div className={`auth-modal ${open ? 'active' : ''}`}>
      <button type="button" className="auth-bg" onClick={onClose} aria-label="Close auth modal background" />

      <div className="auth-modal-stack">
        <button type="button" className="auth-close" onClick={onClose} aria-label="Close auth modal">
          ✕
        </button>

        <div className="auth-box">
          <div className="my-bracket my-b-tl auth-bracket" />
          <div className="my-bracket my-b-tr auth-bracket" />

          <div className="auth-header">
            <button type="button" className={`auth-tab ${authTab === 'login' ? 'active' : ''}`} onClick={() => onTabChange('login')}>
              [ LOGIN ]
            </button>
            <button type="button" className={`auth-tab ${authTab === 'register' ? 'active' : ''}`} onClick={() => onTabChange('register')}>
              [ REGISTER ]
            </button>
          </div>

          <div className="auth-body">
            <button type="button" className="btn-google" onClick={onSimulateLogin}>
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Auth via Google
            </button>

            <div className="divider">OR USE PASSKEY</div>

            <div className="input-group">
              <label>Email (信箱地址)</label>
              <input type="email" placeholder="NODE@DAWANG.COM" />
            </div>

            {authTab === 'register' ? (
              <div className="input-group">
                <label>Verification Code (邮箱验证码)</label>
                <div className="verify-row">
                  <input type="text" placeholder="6-DIGIT CODE" />
                  <button type="button" className="btn-verify">
                    GET CODE
                  </button>
                </div>
              </div>
            ) : null}

            <div className="input-group">
              <label>Passkey (访问密钥)</label>
              <input type="password" placeholder="••••••••" />
            </div>

            <button type="button" className="btn-auth" onClick={onSimulateLogin} disabled={isAuthConnecting}>
              {isAuthConnecting ? '[ CONNECTING... ]' : authTab === 'login' ? 'Initialize Node (登 录)' : 'Register Node (注 册)'}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthModal
