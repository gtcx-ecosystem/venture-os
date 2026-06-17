"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWorkspace } from "./WorkspaceProvider";

const NAV = [
  { href: "/", icon: "C", label: "Command Center" },
  { href: "/capital", icon: "K", label: "Capital Desk" },
  { href: "/growth", icon: "G", label: "Growth Desk" },
  { href: "/visibility", icon: "V", label: "Visibility Desk" },
  { href: "/collateral", icon: "D", label: "Collateral Factory" },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const { search, setSearch } = useWorkspace();

  return (
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
        <input
          id="globalSearch"
          type="search"
          placeholder="Search clients, deals, sources"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </label>

      <nav className="nav-stack" aria-label="Primary">
        {NAV.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const className = active ? "nav-item is-active" : "nav-item";
          return (
            <Link key={item.href} href={item.href} className={className}>
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
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
  );
}

