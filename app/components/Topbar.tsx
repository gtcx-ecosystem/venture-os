"use client";

import { useWorkspace } from "./WorkspaceProvider";

export function Topbar(props: { title?: string }) {
  const { setCommandPaletteOpen } = useWorkspace();

  return (
    <header className="topbar">
      <div className="tabs" role="tablist" aria-label="Open workspaces">
        <button className="tab is-active" type="button">
          {props.title ?? "Venture OS"}
        </button>
        <button className="tab add-tab" type="button" aria-label="New workspace">
          +
        </button>
      </div>
      <div className="topbar-actions">
        <button className="ghost-button" type="button" onClick={() => setCommandPaletteOpen(true)}>
          ⌘K
        </button>
        <button className="ghost-button" type="button">
          Share
        </button>
        <button className="primary-button" type="button">
          Publish brief
        </button>
      </div>
    </header>
  );
}
