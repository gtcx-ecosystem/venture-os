export default function CapitalDeskPage() {
  return (
    <div className="app-shell">
      <main className="main-workspace">
        <header className="topbar">
          <div className="tabs" role="tablist" aria-label="Open workspaces">
            <button className="tab is-active" type="button">
              Capital Desk
            </button>
          </div>
        </header>
        <section className="hero-panel" aria-label="Capital desk">
          <div className="hero-copy">
            <div className="eyebrow">Capital desk</div>
            <h1>Pipeline, investor operations, and approvals.</h1>
            <p>Route opportunities, draft collateral, and approve external moves.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

