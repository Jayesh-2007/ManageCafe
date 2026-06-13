import { Search } from 'lucide-react';

export default function KDSSearch({ search, onSearchChange }) {
  return (
    <div className="relative flex-1 min-w-[200px] max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
        placeholder="Search order #, customer, or item..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}
