import { AppShell } from "../../components/AppShell";
import { DeskPipelineWorkspace } from "../../components/DeskPipelineWorkspace";

export default function GrowthDeskPage() {
  return (
    <AppShell topbarTitle="Growth Desk">
      <DeskPipelineWorkspace desk="growth" />
    </AppShell>
  );
}
