export default function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <div className="bg-red-50 text-red-500 p-4 rounded-md border border-red-100 my-4">
      {message}
    </div>
  );
}
