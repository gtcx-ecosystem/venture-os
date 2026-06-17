import { AppShell } from "@/components/AppShell";
import { SignalsWorkspace } from "@/components/SignalsWorkspace";

export default function SignalsPage() {
  return (
    <AppShell topbarTitle="Signals">
      <SignalsWorkspace />
    </AppShell>
  );
}
