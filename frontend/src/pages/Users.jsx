export default function Users() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center mt-2">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-50 text-primary-600 mb-6">
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-3">Users</h2>
      <p className="text-gray-500 max-w-md mx-auto text-lg">This feature is currently under construction. Please check back later.</p>
    </div>
  );
}