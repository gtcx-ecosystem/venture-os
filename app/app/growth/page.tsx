export default function GrowthDeskPage() {
  return (
    <div className="app-shell">
      <main className="main-workspace">
        <header className="topbar">
          <div className="tabs" role="tablist" aria-label="Open workspaces">
            <button className="tab is-active" type="button">
              Growth Desk
            </button>
          </div>
        </header>
        <section className="hero-panel" aria-label="Growth desk">
          <div className="hero-copy">
            <div className="eyebrow">Growth desk</div>
            <h1>Revenue pipeline, pilots, and partnerships.</h1>
            <p>Turn signals into pilots, pilots into revenue, and revenue into repeatable playbooks.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

