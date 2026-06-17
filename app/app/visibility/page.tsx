import { AppShell } from "../../components/AppShell";
import { DeskPipelineWorkspace } from "../../components/DeskPipelineWorkspace";

export default function VisibilityDeskPage() {
  return (
    <AppShell topbarTitle="Visibility Desk">
      <DeskPipelineWorkspace desk="visibility" />
    </AppShell>
  );
}
