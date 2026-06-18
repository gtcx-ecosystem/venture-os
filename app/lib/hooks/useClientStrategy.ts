"use client";

import { useCallback, useEffect, useState } from "react";
import type { CanonStrategySummary } from "@/lib/automation/canon-strategy-shared";

export function useClientStrategy(clientId: string) {
  const [strategy, setStrategy] = useState<CanonStrategySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/venture/clients/${encodeURIComponent(clientId)}/strategy`)
      .then((response) => {
        if (response.status === 404) {
          setStrategy(null);
          return null;
        }
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json() as Promise<{ strategy: CanonStrategySummary }>;
      })
      .then((data) => {
        if (data?.strategy) setStrategy(data.strategy);
      })
      .catch(() => setError("Could not load fleet canon strategy."))
      .finally(() => setLoading(false));
  }, [clientId]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { strategy, loading, error, reload };
}
