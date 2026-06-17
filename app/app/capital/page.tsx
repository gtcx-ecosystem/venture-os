import { AppShell } from "../../components/AppShell";
import { DeskPipelineWorkspace } from "../../components/DeskPipelineWorkspace";

export default function CapitalDeskPage() {
  return (
    <AppShell topbarTitle="Capital Desk">
      <DeskPipelineWorkspace desk="capital" />
    </AppShell>
  );
}
