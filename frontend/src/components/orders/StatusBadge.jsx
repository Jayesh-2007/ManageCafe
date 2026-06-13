function StatusBadge({ status }) {
  const isPaid = status.toLowerCase() === 'paid';

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-caption font-semibold border ${
        isPaid
          ? 'bg-success/10 text-success border-success/30'
          : 'bg-warning/10 text-warning border-warning/30'
      }`}
    >
      {status}
    </span>
  );
}

export default StatusBadge;
