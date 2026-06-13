const variants = {
  success: 'border-success bg-surface text-copy-primary',
  error: 'border-error bg-surface text-copy-primary',
  warning: 'border-warning bg-surface text-copy-primary',
};

function Toast({ message, type = 'success' }) {
  if (!message) {
    return null;
  }

  return (
    <div
      role="status"
      className={`rounded border-l-4 px-4 py-2 text-body shadow-sm ${variants[type] ?? variants.success}`}
    >
      {message}
    </div>
  );
}

export default Toast;
