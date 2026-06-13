export default function StatusBadge({ active, text }) {
  if (active === undefined) return null;
  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
      {text || (active ? 'Active' : 'Inactive')}
    </span>
  );
}
