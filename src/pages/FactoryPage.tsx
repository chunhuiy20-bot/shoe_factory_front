import { useEffect, useState } from 'react'
import { factoryCameras, factoryQueueItems, factorySteps, formatFactoryEta, formatFactoryTime } from '../data'

function FactoryPage() {
  const [activeCamId, setActiveCamId] = useState(factoryCameras[1].id)
  const [realTime, setRealTime] = useState(() => formatFactoryTime(new Date()))
  const [etaSeconds, setEtaSeconds] = useState(14 * 3600 + 22 * 60 + 5)
  const activeCam = factoryCameras.find((cam) => cam.id === activeCamId) ?? factoryCameras[1]
  const rollingQueue = [...factoryQueueItems, ...factoryQueueItems]

  useEffect(() => {
    const timerId = window.setInterval(() => setRealTime(formatFactoryTime(new Date())), 1000)
    return () => window.clearInterval(timerId)
  }, [])

  useEffect(() => {
    const timerId = window.setInterval(() => setEtaSeconds((prev) => Math.max(0, prev - 1)), 1000)
    return () => window.clearInterval(timerId)
  }, [])

  return (
    <div className="factory-page">
      <header className="factory-dashboard-header">
        <div className="factory-page-title">
          <h1>The Factory.</h1>
        </div>
      </header>

      <div className="factory-global-queue">
        <div className="factory-queue-track">
          {rollingQueue.map((item, index) => {
            const [prefix, orderPart, locPart, statusPart] = item.split('|')
            return (
              <div key={`${item}-${index}`} className="factory-queue-item">
                <span>{prefix.trim()}</span>
                <span className="q-id">{orderPart?.replace('ORDER:', '').trim()}</span>
                <span>{locPart?.trim()}</span>
                <span className="q-status">{statusPart?.trim()}</span>
              </div>
            )
          })}
        </div>
      </div>

      <main className="factory-control-room">
        <section className="factory-live-monitor">
          <div className="factory-video-feed">
            <div className="factory-osd-top-left">
              <div className="factory-live-badge">
                <div className="factory-dot-red" /> LIVE RECORDING
              </div>
              <div className="factory-cam-info">{activeCam.info}</div>
            </div>

            <svg className="factory-crosshair" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <line x1="50%" y1="0" x2="50%" y2="100%" stroke="white" strokeWidth="1" strokeDasharray="5,5" />
              <line x1="0" y1="50%" x2="100%" y2="50%" stroke="white" strokeWidth="1" strokeDasharray="5,5" />
              <circle cx="50%" cy="50%" r="30" fill="none" stroke="white" strokeWidth="1" />
            </svg>

            <div className="factory-video-feed-text">{activeCam.feedText}</div>

            <div className="factory-osd-bottom-right">
              DAWANG ENGINE V1.0.4
              <br />
              <span>{realTime}</span>
            </div>
          </div>

          <div className="factory-cam-switcher">
            {factoryCameras.map((camera) => (
              <button
                key={camera.id}
                type="button"
                className={`factory-cam-btn ${camera.id === activeCam.id ? 'active' : ''}`}
                onClick={() => setActiveCamId(camera.id)}
              >
                {camera.label}
              </button>
            ))}
          </div>
        </section>

        <section className="factory-order-panel">
          <div className="factory-panel-header">
            <h3>My Prototype</h3>
            <span className="factory-order-id">#DW-9920X</span>
          </div>

          <div className="factory-order-content">
            <div className="factory-order-preview">
              <span>[ YOUR_DESIGN_BLUEPRINT ]</span>
            </div>

            <div className="factory-eta-box">
              <div className="label">ESTIMATED TIME TO COMPLETION</div>
              <div className="time">{formatFactoryEta(etaSeconds)}</div>
            </div>

            <div className="factory-tracker">
              {factorySteps.map((step, index) => (
                <div key={step.key} className={`factory-step ${step.state} ${index === factorySteps.length - 1 ? 'last' : ''}`}>
                  <div className="factory-step-icon">{step.state === 'active' ? <div className="factory-inner-dot" /> : null}</div>
                  <div className="factory-step-info">
                    <h4>{step.title}</h4>
                    <p>{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default FactoryPage
