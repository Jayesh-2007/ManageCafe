import { useState } from 'react';
import apiClient from '../services/apiClient';

export default function IntegrationTest() {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  const runTest = async (name, apiCall) => {
    try {
      const res = await apiCall();
      const count = Array.isArray(res?.data?.data || res?.data) ? (res.data.data || res.data).length : 1;
      setResults(prev => ({
        ...prev,
        [name]: { status: 'success', count }
      }));
    } catch (err) {
      setResults(prev => ({
        ...prev,
        [name]: { status: 'error', message: err.message }
      }));
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    setResults({});
    
    // Auth Test (Will fail 401 if not logged in, but we can test if the endpoint exists)
    await runTest('Auth: GET /auth/me', () => apiClient.get('/auth/me'));
    
    // Categories Test
    await runTest('Categories: GET /categories', () => apiClient.get('/categories'));
    
    // Products Test
    await runTest('Products: GET /products', () => apiClient.get('/products'));
    
    // Customers Test
    await runTest('Customers: GET /customers', () => apiClient.get('/customers'));
    
    // Orders Test
    await runTest('Orders: GET /orders', () => apiClient.get('/orders'));
    
    // KDS Test
    await runTest('KDS: GET /kds', () => apiClient.get('/kds'));
    
    // Reports Test
    await runTest('Reports: GET /reports/summary', () => apiClient.get('/reports/summary'));

    setLoading(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold mb-4">Backend Integration Test</h1>
        <p className="text-gray-500 mb-6">Temporary internal page to verify backend connectivity across all modules.</p>
        
        <button 
          onClick={runAllTests} 
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50"
        >
          {loading ? 'Running Tests...' : 'Run Integration Tests'}
        </button>
      </div>

      <div className="space-y-4">
        {Object.entries(results).map(([name, result]) => (
          <div key={name} className={`p-4 rounded-lg border ${result.status === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900">{name}</h3>
              <span className={`font-medium px-2 py-1 rounded text-xs ${result.status === 'success' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                {result.status.toUpperCase()}
              </span>
            </div>
            {result.status === 'success' && (
              <p className="text-sm text-green-700 mt-2">Data items received: {result.count}</p>
            )}
            {result.status === 'error' && (
              <p className="text-sm text-red-700 mt-2">Error: {result.message}</p>
            )}
          </div>
        ))}
        {Object.keys(results).length === 0 && !loading && (
          <div className="p-8 text-center text-gray-400 border border-dashed rounded-lg">
            No tests run yet. Click the button above to start.
          </div>
        )}
      </div>
    </div>
  );
}
