import { AppShell } from "../components/AppShell";
import { CommandCenterWorkspace } from "../components/CommandCenterWorkspace";

export default function Home() {
  return (
    <AppShell topbarTitle="TerraOS Capital Sprint">
      <CommandCenterWorkspace />
    </AppShell>
  );
}
