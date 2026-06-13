import { useState } from 'react';
import { Download } from 'lucide-react';
import { reportService } from '../../services/reportService';
import Button from '../ui/Button';

export default function ExportReports({ dateRange }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleExport = async () => {
    setLoading(true);
    setError('');
    try {
      await reportService.exportReport({ range: dateRange });
    } catch (err) {
      console.error(err);
      setError('Failed to export report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {error && <span className="text-red-500 text-xs">{error}</span>}
      <Button 
        variant="outline" 
        onClick={handleExport} 
        disabled={loading}
        className="flex items-center gap-2 bg-white"
      >
        <Download size={16} />
        {loading ? 'Exporting...' : 'Export CSV'}
      </Button>
    </div>
  );
}
