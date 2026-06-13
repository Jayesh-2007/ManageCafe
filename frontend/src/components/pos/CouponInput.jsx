import { useState } from 'react';
import api from '../../services/api';
import Button from '../ui/Button';

export default function CouponInput({ onApply, appliedCoupon, onRemove }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleValidate = async () => {
    if (!code) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/promotions/validate', { code });
      onApply(res.data.promotion || res.data);
      setCode('');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid coupon code');
    } finally {
      setLoading(false);
    }
  };

  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between bg-green-50 text-green-700 p-2 rounded-md border border-green-200">
        <div className="text-sm font-medium">
          Applied: {appliedCoupon.code} 
          {appliedCoupon.discount_type === 'percentage' ? ` (${appliedCoupon.discount_value}% off)` : ` ($${appliedCoupon.discount_value} off)`}
        </div>
        <button onClick={onRemove} className="text-green-800 hover:text-green-900 font-bold">&times;</button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Promo Code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-primary-500 uppercase"
        />
        <Button 
          variant="secondary" 
          className="text-sm py-1.5 px-3" 
          onClick={handleValidate}
          disabled={loading || !code}
        >
          {loading ? '...' : 'Apply'}
        </Button>
      </div>
      {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
    </div>
  );
}
