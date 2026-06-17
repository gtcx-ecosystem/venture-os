import { AppShell } from "../../components/AppShell";
import { DeskPipelineWorkspace } from "../../components/DeskPipelineWorkspace";

export default function CollateralDeskPage() {
  return (
    <AppShell topbarTitle="Collateral Factory">
      <DeskPipelineWorkspace desk="collateral" />
    </AppShell>
  );
}
