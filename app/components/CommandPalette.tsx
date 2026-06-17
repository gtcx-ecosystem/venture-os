"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { SIDEBAR_CLIENTS } from "@/lib/clients";
import { useWorkspace } from "./WorkspaceProvider";

type Command = {
  id: string;
  label: string;
  hint?: string;
  action: () => void;
};

export function CommandPalette() {
  const router = useRouter();
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    setSelectedClientId,
    requestApprovalsDrawer,
    receipts,
    selectedClientId,
  } = useWorkspace();
  const [query, setQuery] = useState("");

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandPaletteOpen(true);
      }
      if (event.key === "Escape") {
        setCommandPaletteOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setCommandPaletteOpen]);

  const commands = useMemo<Command[]>(() => {
    const nav: Command[] = [
      { id: "nav-home", label: "Go to Command Center", hint: "/", action: () => router.push("/") },
      { id: "nav-brief", label: "Go to Rolling Brief", hint: "/brief", action: () => router.push("/brief") },
      { id: "nav-intake", label: "Go to Client Intake", hint: "/intake", action: () => router.push("/intake") },
      { id: "nav-operations", label: "Go to Operations Hub", hint: "/operations", action: () => router.push("/operations") },
      { id: "nav-sources", label: "Go to Sources", hint: "/sources", action: () => router.push("/sources") },
      { id: "nav-signals", label: "Go to Signals", hint: "/signals", action: () => router.push("/signals") },
      { id: "nav-clients", label: "Go to Clients", hint: "/clients", action: () => router.push("/clients") },
      { id: "nav-opportunities", label: "Go to Opportunities", hint: "/opportunities", action: () => router.push("/opportunities") },
      { id: "nav-capital", label: "Go to Capital Desk", hint: "/capital", action: () => router.push("/capital") },
      { id: "nav-tools", label: "Go to Tool Registry", hint: "/tools", action: () => router.push("/tools") },
      {
        id: "action-approvals",
        label: "Open approvals drawer",
        hint: "brief",
        action: () => {
          router.push("/brief");
          requestApprovalsDrawer();
        },
      },
      {
        id: "action-queue",
        label: "Queue workflow",
        hint: "command center",
        action: () => {
          void fetch("/api/venture/workflow/queue", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              clientId: selectedClientId,
              prompt: "Queue workflow from command palette",
            }),
          });
          router.push("/");
        },
      },
    ];

    const clients: Command[] = SIDEBAR_CLIENTS.map((client) => ({
      id: `client-${client.client_id}`,
      label: `Switch client: ${client.name.replace("FIFTY-FOUR / ", "")}`,
      hint: client.client_id,
      action: () => setSelectedClientId(client.client_id),
    }));

    return [...nav, ...clients];
  }, [router, requestApprovalsDrawer, setSelectedClientId, selectedClientId]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => (c.label + " " + (c.hint ?? "")).toLowerCase().includes(q));
  }, [commands, query]);

  if (!commandPaletteOpen) return null;

  function run(command: Command) {
    command.action();
    setCommandPaletteOpen(false);
    setQuery("");
  }

  return (
    <div
      role="dialog"
      aria-label="Command palette"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(0,0,0,.55)",
        display: "grid",
        placeItems: "start center",
        paddingTop: "12vh",
      }}
      onClick={() => setCommandPaletteOpen(false)}
    >
      <div
        style={{
          width: "min(640px, 92vw)",
          border: "1px solid var(--stroke)",
          borderRadius: 14,
          background: "var(--panel-strong)",
          boxShadow: "var(--shadow)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--stroke-soft)" }}>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command…"
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid var(--stroke)",
              background: "rgba(255,255,255,.02)",
              color: "var(--text)",
            }}
          />
          <p style={{ margin: "8px 0 0", fontSize: 12, color: "var(--subtle)" }}>
            ⌘K · {receipts.length} selection receipts logged
          </p>
        </div>
        <div style={{ maxHeight: 360, overflow: "auto" }}>
          {visible.map((command) => (
            <button
              key={command.id}
              type="button"
              onClick={() => run(command)}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "12px 14px",
                border: "none",
                borderBottom: "1px solid var(--stroke-soft)",
                background: "transparent",
                color: "var(--text)",
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <span>{command.label}</span>
              {command.hint ? <span style={{ color: "var(--subtle)", fontSize: 12 }}>{command.hint}</span> : null}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
