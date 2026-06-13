import { useState } from 'react';
import { Minus, Plus, Trash2, User, Send, CreditCard } from 'lucide-react';
import CustomerModal from './CustomerModal';
import CouponInput from './CouponInput';
import PaymentPanel from './PaymentPanel';
import { orderService } from '../../services/orderService';
import Button from '../ui/Button';

export default function CartPanel({ cart }) {
  const { cartItems, updateQuantity, removeItem, clearCart, subtotal, estimatedTax } = cart;
  
  const [customer, setCustomer] = useState(null);
  const [coupon, setCoupon] = useState(null);
  const [isCustomerModalOpen, setCustomerModalOpen] = useState(false);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  
  // Order State
  const [orderId, setOrderId] = useState(null);
  const [backendTotals, setBackendTotals] = useState(null);
  const [isSendingToKitchen, setIsSendingToKitchen] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [kitchenStatus, setKitchenStatus] = useState('draft'); // draft -> kitchen -> paid

  const handleCreateOrUpdateOrder = async () => {
    setIsCreatingOrder(true);
    try {
      const payload = {
        customer_id: customer?.id,
        table_id: null,
        coupon_code: coupon?.code,
        items: cartItems.map(item => ({ product_id: item.product_id, quantity: item.quantity }))
      };

      let res;
      if (orderId) {
        res = await orderService.updateOrder(orderId, payload);
      } else {
        res = await orderService.createOrder(payload);
        setOrderId(res.data?.id || res.order?.id || res.id);
      }
      
      // Store real backend response totals
      const savedOrder = res.data || res.order || res;
      setBackendTotals({
        subtotal: savedOrder.subtotal,
        tax_total: savedOrder.tax_total,
        discount_total: savedOrder.discount_total,
        total: savedOrder.total
      });
      return savedOrder;
    } catch (error) {
      console.error('Failed to sync order:', error);
      alert('Failed to sync order with server.');
      throw error;
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handleSendToKitchen = async () => {
    if (cartItems.length === 0) return;
    try {
      setIsSendingToKitchen(true);
      const saved = await handleCreateOrUpdateOrder();
      await orderService.sendToKitchen(saved.id);
      setKitchenStatus('kitchen');
    } catch (error) {
      console.error(error);
    } finally {
      setIsSendingToKitchen(false);
    }
  };

  const handlePayClick = async () => {
    if (cartItems.length === 0) return;
    try {
      await handleCreateOrUpdateOrder();
      setPaymentModalOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  const resetAll = () => {
    clearCart();
    setCustomer(null);
    setCoupon(null);
    setOrderId(null);
    setBackendTotals(null);
    setKitchenStatus('draft');
    setPaymentModalOpen(false);
  };

  // Determine display values (fallback to visual estimate if backend totals not yet available)
  const displaySubtotal = backendTotals?.subtotal ?? subtotal;
  const displayTax = backendTotals?.tax_total ?? estimatedTax;
  const displayDiscount = backendTotals?.discount_total ?? 0;
  const displayTotal = backendTotals?.total ?? (subtotal + estimatedTax - displayDiscount);

  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-200 lg:w-[350px] xl:w-[400px]">
      {/* Customer Header */}
      <div className="p-4 border-b border-gray-200">
        <button 
          onClick={() => setCustomerModalOpen(true)}
          className="w-full flex items-center justify-between p-3 rounded-lg border border-dashed border-gray-300 hover:bg-gray-50 hover:border-primary-400 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
              <User size={18} />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-900">{customer ? customer.name : 'Add Customer'}</p>
              {customer && <p className="text-xs text-gray-500">{customer.phone || customer.email}</p>}
            </div>
          </div>
          {customer && (
             <span className="text-xs text-red-500 hover:text-red-700" onClick={(e) => { e.stopPropagation(); setCustomer(null); }}>Remove</span>
          )}
        </button>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
            <ShoppingCartIcon />
            <p>Your cart is empty</p>
          </div>
        ) : (
          cartItems.map((item) => (
            <div key={item.product_id} className="flex gap-3 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
                <p className="text-xs text-gray-500 font-medium mt-1">${Number(item.price).toFixed(2)}</p>
              </div>
              
              <div className="flex flex-col items-end justify-between gap-2">
                <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1 border">
                  <button onClick={() => updateQuantity(item.product_id, -1)} className="w-6 h-6 flex items-center justify-center bg-white rounded text-gray-600 shadow-sm hover:text-primary-600"><Minus size={14}/></button>
                  <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product_id, 1)} className="w-6 h-6 flex items-center justify-center bg-white rounded text-gray-600 shadow-sm hover:text-primary-600"><Plus size={14}/></button>
                </div>
                <button onClick={() => removeItem(item.product_id)} className="text-red-400 hover:text-red-600 p-1">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer / Summary */}
      <div className="bg-gray-50 border-t border-gray-200 p-4 space-y-4">
        <CouponInput onApply={setCoupon} appliedCoupon={coupon} onRemove={() => setCoupon(null)} />
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between"><span>Subtotal</span><span>${Number(displaySubtotal).toFixed(2)}</span></div>
          {displayDiscount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-${Number(displayDiscount).toFixed(2)}</span></div>}
          <div className="flex justify-between"><span>Tax</span><span>${Number(displayTax).toFixed(2)}</span></div>
          <div className="flex justify-between font-bold text-gray-900 text-lg pt-2 border-t border-gray-200">
            <span>Total</span><span>${Number(Math.max(0, displayTotal)).toFixed(2)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button 
            variant="outline" 
            className="flex items-center justify-center gap-2 border-orange-200 text-orange-600 hover:bg-orange-50"
            onClick={handleSendToKitchen}
            disabled={cartItems.length === 0 || isSendingToKitchen || kitchenStatus === 'kitchen'}
          >
            <Send size={18} />
            {kitchenStatus === 'kitchen' ? 'Sent' : 'Kitchen'}
          </Button>
          
          <Button 
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 focus:ring-green-500"
            onClick={handlePayClick}
            disabled={cartItems.length === 0 || isCreatingOrder}
          >
            <CreditCard size={18} />
            Pay
          </Button>
        </div>
      </div>

      <CustomerModal isOpen={isCustomerModalOpen} onClose={() => setCustomerModalOpen(false)} onSelect={setCustomer} />
      <PaymentPanel isOpen={isPaymentModalOpen} onClose={() => setPaymentModalOpen(false)} orderId={orderId} orderTotal={displayTotal} onSuccess={resetAll} />
    </div>
  );
}

function ShoppingCartIcon() {
  return (
    <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}
