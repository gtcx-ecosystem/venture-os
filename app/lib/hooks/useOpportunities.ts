"use client";

import { useCallback, useEffect, useState } from "react";
import type { Opportunity } from "@/lib/mock";

type OpportunitiesResponse = {
  opportunities: Opportunity[];
};

export function useOpportunities(clientId: string) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const reload = useCallback(() => {
    setLoading(true);
    setReloadToken((n) => n + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/venture/opportunities?clientId=${encodeURIComponent(clientId)}`)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json() as Promise<OpportunitiesResponse>;
      })
      .then((data) => {
        if (cancelled) return;
        setOpportunities(data.opportunities);
        setError(null);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load opportunities.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [clientId, reloadToken]);

  return { opportunities, loading, error, reload };
}
