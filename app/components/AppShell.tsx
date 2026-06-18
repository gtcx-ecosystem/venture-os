import type { ReactNode } from "react";
import { CommandPalette } from "./CommandPalette";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppShell(props: { children: ReactNode; topbarTitle?: string }) {
  return (
    <>
      <div className="app-shell">
        <Sidebar />
        <main className="main-workspace">
          <Topbar title={props.topbarTitle} />
          {props.children}
        </main>
      </div>
      <CommandPalette />
    </>
  );
}
