import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { WorkspaceProvider } from "./WorkspaceProvider";

export function AppShell(props: { children: ReactNode; topbarTitle?: string }) {
  return (
    <WorkspaceProvider>
      <div className="app-shell">
        <Sidebar />
        <main className="main-workspace">
          <Topbar title={props.topbarTitle} />
          {props.children}
        </main>
      </div>
    </WorkspaceProvider>
  );
}

