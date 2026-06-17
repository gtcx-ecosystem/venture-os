type WorkspaceEmptyStateProps = {
  title: string;
  detail: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function SkeletonOpportunityGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="card-grid skeleton-grid" aria-busy="true" aria-label="Loading opportunities">
      {Array.from({ length: count }, (_, index) => (
        <article key={index} className="skeleton-card">
          <div className="skeleton-visual" />
          <div className="skeleton-body">
            <div className="skeleton-line skeleton-line--wide" />
            <div className="skeleton-line" />
            <div className="skeleton-line skeleton-line--short" />
          </div>
        </article>
      ))}
    </div>
  );
}

export function WorkspaceEmptyState({ title, detail, actionLabel, onAction }: WorkspaceEmptyStateProps) {
  return (
    <div className="workspace-state workspace-state--empty" role="status">
      <strong>{title}</strong>
      <p>{detail}</p>
      {actionLabel && onAction ? (
        <button className="small-button" type="button" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

export function WorkspaceErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="workspace-state workspace-state--error" role="alert">
      <strong>Could not load workspace data</strong>
      <p>{message}</p>
      {onRetry ? (
        <button className="small-button" type="button" onClick={onRetry}>
          Retry
        </button>
      ) : null}
    </div>
  );
}
