"use client";

import type { ReactNode } from "react";
import { WorkspaceProvider } from "./WorkspaceProvider";

export function AppProviders(props: { children: ReactNode }) {
  return <WorkspaceProvider>{props.children}</WorkspaceProvider>;
}
