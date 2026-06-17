"use client";

import { useRouter } from "next/navigation";
import { useWorkspace } from "./WorkspaceProvider";

export function Topbar(props: { title?: string }) {
  const router = useRouter();
  const { setCommandPaletteOpen, setApprovalsDrawerOpen } = useWorkspace();

  function openPublishBrief() {
    router.push("/brief");
    setApprovalsDrawerOpen(true);
  }

  return (
    <header className="topbar">
      <div className="tabs" role="tablist" aria-label="Open workspaces">
        <button className="tab is-active" type="button">
          {props.title ?? "Venture OS"}
        </button>
        <button className="tab add-tab" type="button" aria-label="New workspace" disabled>
          +
        </button>
      </div>
      <div className="topbar-actions">
        <button className="ghost-button" type="button" onClick={() => setCommandPaletteOpen(true)}>
          ⌘K
        </button>
        <button className="ghost-button" type="button" disabled title="Share — Class A gate pending">
          Share
        </button>
        <button className="primary-button" type="button" onClick={openPublishBrief}>
          Publish brief
        </button>
      </div>
    </header>
  );
}
