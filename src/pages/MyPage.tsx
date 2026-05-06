import { getDesignImage, myMatrixCards, myOrders } from '../data'

type MyPageProps = {
  onNavigateFactory: () => void
}

function MyPage({ onNavigateFactory }: MyPageProps) {
  return (
    <main className="my-dashboard-container">
      <header className="my-profile-header">
        <div className="my-profile-avatar">
          <img src="https://ui-avatars.com/api/?name=A+D&background=f4f4f5&color=111&font-size=0.4" alt="avatar" />
        </div>
        <div className="my-profile-info">
          <h1>@Alex_Design</h1>
          <div className="my-profile-tags">
            <span className="my-tag primary">COMMUNITY_CREATOR</span>
            <span className="my-tag">SYS_NODE_ACTIVE</span>
            <span className="my-tag">JOINED: 2025.10</span>
          </div>
        </div>
      </header>

      <section className="my-top-grid">
        <div className="my-panel my-financial-panel">
          <div className="my-panel-title">
            <strong>Financial Node</strong>
          </div>

          <span className="my-fin-subtitle">AVAILABLE YIELD (可提现收益)</span>
          <div className="my-balance-huge">¥ 12,450.00</div>

          <div className="my-fin-stats">
            <div className="my-f-stat">
              <span className="lbl">PENDING SETTLEMENT (待结算)</span>
              <span className="val">¥ 3,200.00</span>
            </div>
            <div className="my-f-stat">
              <span className="lbl">COMMISSION RATE (抽成比)</span>
              <span className="val">15.0%</span>
            </div>
          </div>

          <button type="button" className="my-btn-withdraw">
            Initiate Withdrawal (提取收益)
          </button>
        </div>

        <div className="my-panel">
          <div className="my-panel-title">
            <strong>Production Queue</strong>
            <span>
              <button type="button" className="my-view-factory-link" onClick={onNavigateFactory}>
                VIEW_FACTORY_LIVE -&gt;
              </button>
            </span>
          </div>

          <div className="my-order-list">
            {myOrders.map((order, index) => (
              <div key={order.id} className={`my-order-item ${order.muted ? 'muted' : ''}`}>
                <div className="my-o-left">
                  <div className="my-o-thumb">
                    <img src={getDesignImage(index)} alt={`order-${index + 1}`} />
                  </div>
                  <div className="my-o-info">
                    <span className="name">{order.name}</span>
                    <span className="id">{order.id}</span>
                  </div>
                </div>
                <div className="my-o-right">
                  <div className="my-status-badge">
                    <div className={`my-dot ${order.statusType}`} />
                    {order.status}
                  </div>
                  <span className="my-o-date">{order.eta}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="my-panel my-matrix-panel">
        <div className="my-panel-title my-panel-title-large">
          <strong>Commission Matrix.</strong>
        </div>

        <div className="my-matrix-grid">
          {myMatrixCards.map((card, index) => (
            <div key={card.name} className={`my-matrix-card ${card.statusType === 'reviewing' ? 'reviewing' : ''}`}>
              <div className="my-mc-visual">
                <img className="my-mc-image" src={getDesignImage(index + myOrders.length)} alt={`matrix-${index + 1}`} />
                <div className="my-bracket my-b-tl" />
                <div className="my-bracket my-b-tr" />
                <div className="my-bracket my-b-bl" />
                <div className="my-bracket my-b-br" />
                <span className="my-mc-visual-text">{card.renderCode}</span>
              </div>
              <div className="my-mc-data">
                <div className="my-mc-header">
                  <h3 className="my-mc-name">{card.name}</h3>
                  <span className={`my-mc-status ${card.statusType === 'reviewing' ? 'reviewing' : ''}`}>{card.status}</span>
                </div>
                <div className="my-mc-stats">
                  <div className="my-s-item">
                    <span className="lbl">CLONED (被制造)</span>
                    <span className="val">{card.cloned}</span>
                  </div>
                  <div className="my-s-item">
                    <span className="lbl">LIKES (获赞)</span>
                    <span className="val">{card.likes}</span>
                  </div>
                  <div className="my-s-item highlight">
                    <span className="lbl">TOTAL YIELD (总收益)</span>
                    <span className="val">{card.yield}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

export default MyPage
