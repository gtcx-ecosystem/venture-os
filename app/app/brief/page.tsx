import { AppShell } from "@/components/AppShell";
import { RollingBriefWorkspace } from "@/components/RollingBriefWorkspace";

export default function BriefPage() {
  return (
    <AppShell topbarTitle="Rolling Brief">
      <RollingBriefWorkspace />
    </AppShell>
  );
}
