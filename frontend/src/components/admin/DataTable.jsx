import { Edit, Trash2 } from 'lucide-react';
import EmptyState from './EmptyState';

export default function DataTable({ columns, data, loading, onEdit, onDelete, keyField = 'id', readOnly = false }) {
  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1,2,3,4,5].map(i => <div key={i} className="h-14 bg-gray-100 rounded-lg"></div>)}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map(col => (
              <th key={col.key} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {col.label}
              </th>
            ))}
            {!readOnly && <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map(row => (
            <tr key={row[keyField]} className="hover:bg-gray-50">
              {columns.map(col => (
                <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
              {!readOnly && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-3">
                    {onEdit && <button onClick={() => onEdit(row)} className="text-blue-600 hover:text-blue-800"><Edit size={18} /></button>}
                    {onDelete && <button onClick={() => onDelete(row)} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
