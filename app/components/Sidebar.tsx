"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWorkspace } from "./WorkspaceProvider";
import { SIDEBAR_CLIENTS, getFleetClientEntry } from "../lib/clients";

const NAV = [
  { href: "/", icon: "C", label: "Command Center" },
  { href: "/brief", icon: "B", label: "Rolling Brief" },
  { href: "/intake", icon: "I", label: "Client Intake" },
  { href: "/operations", icon: "O", label: "Operations" },
  { href: "/sources", icon: "S", label: "Sources" },
  { href: "/signals", icon: "N", label: "Signals" },
  { href: "/clients", icon: "L", label: "Clients" },
  { href: "/opportunities", icon: "P", label: "Opportunities" },
  { href: "/capital", icon: "K", label: "Capital Desk" },
  { href: "/growth", icon: "G", label: "Growth Desk" },
  { href: "/visibility", icon: "V", label: "Visibility Desk" },
  { href: "/collateral", icon: "D", label: "Collateral Factory" },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const { search, setSearch, selectedClientId, setSelectedClientId } = useWorkspace();

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
        {SIDEBAR_CLIENTS.map((client) => {
          const fleet = getFleetClientEntry(client.client_id);
          const label = client.name.replace("FIFTY-FOUR / ", "");
          return (
            <div key={client.client_id} className="folder-row-wrap">
              <button
                className={
                  selectedClientId === client.client_id ? "folder-row is-selected" : "folder-row"
                }
                type="button"
                onClick={() => setSelectedClientId(client.client_id)}
              >
                <span className="folder-icon" />
                {label}
              </button>
              {fleet ? (
                <a
                  href={fleet.githubUrl}
                  className="folder-repo-link"
                  target="_blank"
                  rel="noreferrer"
                  title={`Open ${fleet.ownerRepo} (${fleet.localPath})`}
                  aria-label={`Open ${label} owner repo`}
                >
                  ↗
                </a>
              ) : null}
            </div>
          );
        })}
      </section>
    </aside>
  );
}
