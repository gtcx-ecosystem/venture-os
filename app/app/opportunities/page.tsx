import { AppShell } from "@/components/AppShell";
import { OpportunitiesWorkspace } from "@/components/OpportunitiesWorkspace";

export default function OpportunitiesPage() {
  return (
    <AppShell topbarTitle="Opportunities">
      <OpportunitiesWorkspace />
    </AppShell>
  );
}
