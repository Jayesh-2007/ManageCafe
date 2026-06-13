function LoadingSpinner({ label = 'Loading' }) {
  return (
    <span
      role="status"
      aria-label={label}
      className="inline-flex h-6 w-6 animate-spin rounded-full border-2 border-border border-t-accent"
    >
      <span className="sr-only">{label}</span>
    </span>
  );
}

export default LoadingSpinner;
