export default function Home() {
  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Workspace navigation">
        <div className="account-row">
          <div className="avatar">GA</div>
          <div>
            <div className="account-name">GTCX Ventures</div>
            <div className="account-meta">Africa Venture OS</div>
          </div>
          <button className="icon-button" type="button" aria-label="Notifications">
            !
          </button>
        </div>

        <label className="sidebar-search">
          <span aria-hidden="true">/</span>
          <input id="globalSearch" type="search" placeholder="Search clients, deals, sources" />
        </label>

        <nav className="nav-stack" aria-label="Primary">
          <button className="nav-item is-active" type="button">
            <span className="nav-icon">C</span>
            <span>Command Center</span>
          </button>
          <button className="nav-item" type="button">
            <span className="nav-icon">K</span>
            <span>Capital Desk</span>
          </button>
          <button className="nav-item" type="button">
            <span className="nav-icon">G</span>
            <span>Growth Desk</span>
          </button>
          <button className="nav-item" type="button">
            <span className="nav-icon">V</span>
            <span>Visibility Desk</span>
          </button>
          <button className="nav-item" type="button">
            <span className="nav-icon">D</span>
            <span>Collateral Factory</span>
          </button>
        </nav>

        <section className="workspace-block">
          <div className="section-label">Clients</div>
          <button className="folder-row is-selected" type="button">
            <span className="folder-icon" />
            TerraOS
          </button>
          <button className="folder-row" type="button">
            <span className="folder-icon" />
            Markets OS
          </button>
          <button className="folder-row" type="button">
            <span className="folder-icon" />
            ComplianceOS
          </button>
          <button className="folder-row" type="button">
            <span className="folder-icon" />
            Nyota AI
          </button>
          <button className="folder-row" type="button">
            <span className="folder-icon" />
            FIFTY-FOUR
          </button>
        </section>
      </aside>

      <main className="main-workspace">
        <header className="topbar">
          <div className="tabs" role="tablist" aria-label="Open workspaces">
            <button className="tab is-active" type="button">
              TerraOS Capital Sprint
            </button>
            <button className="tab" type="button">
              Markets OS Buyer Pipeline
            </button>
            <button className="tab" type="button">
              Nyota Channel Partners
            </button>
            <button className="tab add-tab" type="button" aria-label="New workspace">
              +
            </button>
          </div>
          <div className="topbar-actions">
            <button className="ghost-button" type="button">
              Share
            </button>
            <button className="primary-button" type="button">
              Publish brief
            </button>
          </div>
        </header>

        <section className="hero-panel" aria-label="Founder command center">
          <div className="orb orb-one" />
          <div className="orb orb-two" />
          <div className="hero-copy">
            <div className="eyebrow">Founder command center</div>
            <h1>Run capital, growth, visibility, and partnerships from one desk.</h1>
            <p>
              Monitor Africa-focused opportunities, draft investor materials, coordinate agents, and approve
              external moves without losing the operating thread.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
