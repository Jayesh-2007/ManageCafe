import { useState } from 'react';
import ErrorMessage from '../../../components/common/ErrorMessage';
import Toast from '../../../components/common/Toast';
import EmptyCartState from './EmptyCartState';

const tabs = ['Cart', 'Payment'];
const customers = [
  { id: 'cust-1', name: 'Aarav Patel', email: 'aarav@example.com', phone: '9876543210' },
  { id: 'cust-2', name: 'Priya Sharma', email: 'priya@example.com', phone: '9876501234' },
  { id: 'cust-3', name: 'Kabir Mehta', email: 'kabir@example.com', phone: '9123456780' },
];
const amountError = 'Amount cannot be less than the order total';

function CartPanel({ items, onQuantityChange }) {
  const [activeTab, setActiveTab] = useState('Cart');
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [amount, setAmount] = useState('');
  const [orderToast, setOrderToast] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [orderId, setOrderId] = useState(1001);
  const [showPaymentErrors, setShowPaymentErrors] = useState(false);

  // Calculations
  const subtotal = items.reduce((total, item) => total + item.price * (item.quantity || 1), 0);
  const gst = Math.round(subtotal * 0.05 * 100) / 100;
  const discount = discountApplied ? Math.round(subtotal * 0.2 * 100) / 100 : 0;
  const orderTotal = Math.max(0, subtotal + gst - discount);

  const parsedAmount = parseFloat(amount) || 0;
  const isAmountInvalid = (amount !== '' || showPaymentErrors) && parsedAmount < orderTotal;

  function handleApplyCoupon() {
    if (couponCode.trim().toUpperCase() === 'SUMMER20') {
      setDiscountApplied(true);
      setCouponError('');
      setCouponCode('');
      setIsCouponModalOpen(false);
      return;
    }

    setCouponError('Invalid or expired coupon code');
  }

  function handleKeypadClick(key) {
    setShowPaymentErrors(false);
    if (key === 'X') {
      setAmount('');
      return;
    }

    setAmount((currentAmount) => {
      if (currentAmount === '0' && key !== '.' && key !== '*' && key !== '-') {
        return key;
      }
      return `${currentAmount}${key}`;
    });
  }

  function handleSend() {
    if (activeTab === 'Payment') {
      if (amount === '' || parsedAmount < orderTotal) {
        setShowPaymentErrors(true);
        return;
      }
    }

    // Process Order Sending
    setOrderToast(`Order Sent - Order #${orderId}`);
    setOrderId((prevId) => prevId + 1);
    setAmount('');
    setShowPaymentErrors(false);

    // Auto-dismiss toast
    setTimeout(() => {
      setOrderToast('');
    }, 3000);
  }

  // Search filter for customers
  const filteredCustomers = customers.filter((customer) => {
    const query = searchQuery.toLowerCase();
    return (
      customer.name.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query) ||
      customer.phone.includes(query)
    );
  });

  return (
    <aside className="flex min-h-0 w-full flex-col border-l border-border bg-background lg:w-[320px] shrink-0">
      {/* Header Tabs */}
      <header className="border-b border-border p-4">
        <div className="flex rounded-lg bg-border/40 p-1 text-center text-label gap-1">
          {tabs.map((tab) => {
            const isSelected = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 rounded-md transition-all duration-150 active:scale-[0.98] text-center font-bold ${
                  isSelected
                    ? 'bg-surface text-accent shadow-sm border border-border/20'
                    : 'text-copy-secondary hover:text-copy-primary hover:bg-surface/50'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </header>

      {/* Toast Notification Container */}
      {orderToast ? (
        <div className="px-4 pt-4">
          <Toast message={orderToast} type="success" />
        </div>
      ) : null}

      {/* Main Tab Content */}
      <div className="flex min-h-0 flex-1 flex-col gap-4 p-4 overflow-y-auto">
        {items.length === 0 ? (
          <EmptyCartState />
        ) : activeTab === 'Payment' ? (
          <div className="flex flex-col gap-4 animate-modal-in">
            {/* Payment Methods */}
            <fieldset className="flex flex-col gap-2 border-0 p-0 m-0">
              <legend className="text-label font-bold text-copy-primary">Payment Method</legend>
              <div className="grid grid-cols-3 gap-2">
                {['Cash', 'UPI', 'Card'].map((method) => {
                  const isChecked = paymentMethod === method;
                  return (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`flex flex-col items-center justify-center min-h-[56px] rounded-lg border text-center transition-all duration-150 active:scale-[0.97] cursor-pointer ${
                        isChecked
                          ? 'border-accent bg-surface font-bold text-accent shadow-sm'
                          : 'border-border bg-background hover:bg-surface/50 text-copy-secondary'
                      }`}
                    >
                      <span className="text-body">{method}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* Payment Amount */}
            <div className="flex flex-col gap-1">
              <label className="text-label font-bold text-copy-primary" htmlFor="payment-amount">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-body font-bold text-copy-secondary">₹</span>
                <input
                  id="payment-amount"
                  inputMode="numeric"
                  value={amount}
                  onChange={(event) => {
                    setShowPaymentErrors(false);
                    setAmount(event.target.value);
                  }}
                  className={`w-full min-h-12 rounded-lg border bg-background pl-8 pr-4 text-body font-bold text-copy-primary outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all ${
                    isAmountInvalid ? 'border-error focus:ring-error/10' : 'border-border'
                  }`}
                  placeholder="0.00"
                />
              </div>
              <ErrorMessage message={isAmountInvalid ? amountError : ''} />
            </div>

            {/* Custom Numpad */}
            <div className="grid grid-cols-3 gap-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '-'].map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleKeypadClick(key)}
                  className="min-h-12 rounded-lg border border-border bg-surface text-body font-bold text-copy-primary hover:border-accent hover:bg-background transition-all active:scale-[0.95] shadow-sm"
                >
                  {key}
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleKeypadClick('X')}
                className="col-span-3 min-h-12 rounded-lg border border-error/30 bg-surface text-body font-bold text-error hover:bg-error hover:text-background transition-all active:scale-[0.98] shadow-sm"
              >
                Clear
              </button>
            </div>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {items.map((item) => (
              <li key={item.cartId} className="rounded-xl border border-border/80 bg-surface p-4 flex flex-col gap-2 shadow-sm hover:border-accent/40 transition-colors">
                <p className="text-body font-bold text-copy-primary tracking-tight">{item.name}</p>
                <div className="flex items-center justify-between">
                  {/* Quantity controls [-] Qty [+] */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onQuantityChange(item.productId, item.quantity - 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-body font-bold text-copy-secondary hover:border-accent hover:text-accent hover:bg-surface transition-all active:scale-90 duration-155"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="text-body font-bold w-8 text-center text-copy-primary">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => onQuantityChange(item.productId, item.quantity + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-body font-bold text-copy-secondary hover:border-accent hover:text-accent hover:bg-surface transition-all active:scale-90 duration-155"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-bold text-copy-primary">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Cart Footer & Pricing Summary */}
      {items.length > 0 && (
        <footer className="mt-auto flex flex-col gap-4 border-t border-border p-4 bg-background">
          {/* Pricing Summary */}
          <div className="flex flex-col gap-2 text-body bg-surface p-4 rounded-xl border border-border/80 shadow-sm">
            <div className="flex justify-between">
              <span className="text-copy-secondary">Subtotal</span>
              <span className="font-bold text-copy-primary">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-copy-secondary">GST (5%)</span>
              <span className="font-bold text-copy-primary">₹{gst.toFixed(2)}</span>
            </div>
            {discountApplied && (
              <div className="flex justify-between text-success font-bold animate-modal-in">
                <span>Discount (20%)</span>
                <span>-₹{discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-dashed border-border pt-2 text-price">
              <span className="font-bold text-copy-primary">Total</span>
              <span className="font-bold text-primary text-lg">₹{orderTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Selected Customer / Discount Badges */}
          <div className="flex flex-col gap-2">
            {selectedCustomer && (
              <div className="flex items-center justify-between rounded-xl border border-accent/20 bg-accent/5 px-4 py-2 text-label text-copy-primary animate-modal-in shadow-sm">
                <div className="flex flex-col">
                  <span className="font-bold text-accent">{selectedCustomer.name}</span>
                  <span className="text-caption text-copy-secondary">{selectedCustomer.phone}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCustomer(null)}
                  className="text-copy-secondary hover:text-error hover:bg-error/10 rounded-full h-6 w-6 flex items-center justify-center text-body font-bold transition-all duration-150 active:scale-90"
                  aria-label="Remove customer"
                >
                  ×
                </button>
              </div>
            )}

            {discountApplied && (
              <div className="flex items-center justify-between rounded-xl border border-success/20 bg-success/5 px-4 py-2 text-label text-success animate-modal-in shadow-sm">
                <span className="font-bold">Coupon SUMMER20 Applied</span>
                <button
                  type="button"
                  onClick={() => setDiscountApplied(false)}
                  className="text-copy-secondary hover:text-error hover:bg-error/10 rounded-full h-6 w-6 flex items-center justify-center text-body font-bold transition-all duration-150 active:scale-90"
                  aria-label="Remove discount"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setIsCustomerModalOpen(true)}
              className="min-h-12 rounded-lg border border-border bg-surface px-2 text-label font-bold text-copy-primary hover:border-accent/50 hover:bg-background hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 shadow-sm"
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => setIsCouponModalOpen(true)}
              className="min-h-12 rounded-lg border border-border bg-surface px-2 text-label font-bold text-copy-primary hover:border-accent/50 hover:bg-background hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 shadow-sm"
            >
              Discount
            </button>
            <button
              type="button"
              onClick={handleSend}
              className="min-h-12 rounded-lg bg-accent px-2 text-label font-bold text-background shadow-md shadow-accent/10 hover:bg-accent/90 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150"
            >
              Send
            </button>
          </div>
        </footer>
      )}

      {/* Customer Search Modal */}
      {isCustomerModalOpen ? (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-[rgba(15,23,42,0.4)] p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-background p-4 animate-modal-in shadow-lg">
            <h2 className="text-section-title font-bold text-primary tracking-tight">Customer Search</h2>
            <input
              className="mt-4 min-h-12 w-full rounded-lg border border-border px-4 text-body text-copy-primary bg-background outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all"
              placeholder="Search by name, email, or phone"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            <div className="mt-4 overflow-y-auto" style={{ maxHeight: '15rem' }}>
              {filteredCustomers.length === 0 ? (
                <p className="text-caption text-copy-secondary py-4 text-center">No customers found.</p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {filteredCustomers.map((customer) => (
                    <li key={customer.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setSearchQuery('');
                          setIsCustomerModalOpen(false);
                        }}
                        className="w-full rounded-xl border border-border bg-surface p-4 text-left transition-all duration-150 hover:border-accent hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0"
                      >
                        <p className="text-body font-bold text-copy-primary">{customer.name}</p>
                        <p className="text-label text-copy-secondary mt-1">{customer.email}</p>
                        <p className="text-label text-copy-secondary">{customer.phone}</p>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-4">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setIsCustomerModalOpen(false);
                }}
                className="min-h-12 w-full rounded-lg bg-surface border border-border text-body font-bold text-copy-primary hover:bg-border/30 active:scale-[0.98] transition-all duration-150 shadow-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Coupon Modal */}
      {isCouponModalOpen ? (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-[rgba(15,23,42,0.4)] p-4">
          <div className="w-full max-w-sm rounded-xl border border-border bg-background p-4 animate-modal-in shadow-lg">
            <h2 className="text-section-title font-bold text-primary tracking-tight">Apply Coupon</h2>
            <div className="mt-4 flex flex-col gap-1">
              <label className="text-label font-bold text-copy-primary" htmlFor="coupon-code">
                Coupon Code
              </label>
              <input
                id="coupon-code"
                value={couponCode}
                onChange={(event) => {
                  setCouponCode(event.target.value);
                  setCouponError('');
                }}
                className={`min-h-12 rounded-lg border bg-background px-4 text-body outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all ${
                  couponError ? 'border-error focus:ring-error/10' : 'border-border'
                }`}
                placeholder="Enter coupon code"
              />
              <ErrorMessage message={couponError} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleApplyCoupon}
                className="min-h-12 rounded-lg bg-accent text-body font-bold text-background hover:bg-accent/90 shadow-md shadow-accent/10 active:scale-[0.98] transition-all duration-150"
              >
                Apply
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsCouponModalOpen(false);
                  setCouponError('');
                  setCouponCode('');
                }}
                className="min-h-12 rounded-lg bg-surface border border-border text-body font-bold text-copy-primary hover:bg-border/30 active:scale-[0.98] transition-all duration-150 shadow-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </aside>
  );
}

export default CartPanel;
