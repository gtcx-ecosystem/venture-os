"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { SelectionReceipt } from "@/lib/tool-registry/receipts";
import {
  completeIntake,
  emptyWorkflowState,
  markPublished,
  setApprovalStatus,
  type ApprovalStatus,
  type ClientWorkflowState,
} from "@/lib/workflow-state";

type WorkspaceContextValue = {
  search: string;
  setSearch: (value: string) => void;
  activeFilter: string;
  setActiveFilter: (value: string) => void;
  selectedClientId: string;
  setSelectedClientId: (value: string) => void;
  receipts: SelectionReceipt[];
  appendReceipt: (receipt: SelectionReceipt) => void;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  approvalsDrawerOpen: boolean;
  setApprovalsDrawerOpen: (open: boolean) => void;
  requestApprovalsDrawer: () => void;
  workflowState: ClientWorkflowState;
  completeClientIntake: () => void;
  updateApprovalStatus: (approvalId: string, status: ApprovalStatus) => void;
  markClientPublished: () => void;
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider(props: { children: ReactNode }) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedClientId, setSelectedClientId] = useState("terra_os");
  const [receipts, setReceipts] = useState<SelectionReceipt[]>([]);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [approvalsDrawerOpen, setApprovalsDrawerOpen] = useState(false);
  const [workflowByClient, setWorkflowByClient] = useState<Record<string, ClientWorkflowState>>({});

  const workflowState = workflowByClient[selectedClientId] ?? emptyWorkflowState();

  const appendReceipt = useCallback((receipt: SelectionReceipt) => {
    setReceipts((prev) => [receipt, ...prev].slice(0, 50));
  }, []);

  const requestApprovalsDrawer = useCallback(() => {
    setApprovalsDrawerOpen(true);
  }, []);

  const completeClientIntake = useCallback(() => {
    setWorkflowByClient((prev) => ({
      ...prev,
      [selectedClientId]: completeIntake(prev[selectedClientId] ?? emptyWorkflowState()),
    }));
  }, [selectedClientId]);

  const updateApprovalStatus = useCallback(
    (approvalId: string, status: ApprovalStatus) => {
      setWorkflowByClient((prev) => ({
        ...prev,
        [selectedClientId]: setApprovalStatus(prev[selectedClientId] ?? emptyWorkflowState(), approvalId, status),
      }));
    },
    [selectedClientId],
  );

  const markClientPublished = useCallback(() => {
    setWorkflowByClient((prev) => ({
      ...prev,
      [selectedClientId]: markPublished(prev[selectedClientId] ?? emptyWorkflowState()),
    }));
  }, [selectedClientId]);

  const value = useMemo(
    () => ({
      search,
      setSearch,
      activeFilter,
      setActiveFilter,
      selectedClientId,
      setSelectedClientId,
      receipts,
      appendReceipt,
      commandPaletteOpen,
      setCommandPaletteOpen,
      approvalsDrawerOpen,
      setApprovalsDrawerOpen,
      requestApprovalsDrawer,
      workflowState,
      completeClientIntake,
      updateApprovalStatus,
      markClientPublished,
    }),
    [
      search,
      activeFilter,
      selectedClientId,
      receipts,
      appendReceipt,
      commandPaletteOpen,
      approvalsDrawerOpen,
      requestApprovalsDrawer,
      workflowState,
      completeClientIntake,
      updateApprovalStatus,
      markClientPublished,
    ],
  );

  return <WorkspaceContext.Provider value={value}>{props.children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used within WorkspaceProvider");
  return ctx;
}
