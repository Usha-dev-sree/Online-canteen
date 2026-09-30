import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createRazorpayOrder, verifyPaymentAndCreateOrder } from '../services/api';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowRight, FiCreditCard, FiLock, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './Cart.css';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();
  const { user } = useAuth();
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [processingPayment, setProcessingPayment] = useState(false);
  const navigate = useNavigate();

  const handleOpenPayment = () => {
    if (cartItems.length === 0) return;
    setShowPaymentModal(true);
  };

  const executeRazorpayGateway = async () => {
    try {
      setProcessingPayment(true);

      // 1. Check Razorpay SDK is loaded
      if (!window.Razorpay) {
        toast.error('Payment SDK not loaded. Please refresh the page and try again.');
        setProcessingPayment(false);
        return;
      }

      // 2. Create Razorpay Order on server
      const orderRes = await createRazorpayOrder(cartTotal);
      const rzpOrderData = orderRes.data;

      const orderPayloadItems = cartItems.map((item) => ({
        menuItem: item._id,
        quantity: item.quantity,
        price: item.price,
      }));

      // 3. Open Real Razorpay Checkout (GPay / PhonePe / UPI / Card)
      const options = {
        key: rzpOrderData.keyId,
        amount: rzpOrderData.amount,
        currency: rzpOrderData.currency,
        name: 'OnlineCanteen',
        description: 'Canteen Food Order Payment',
        order_id: rzpOrderData.id,
        handler: async function (response) {
          // Only called by Razorpay AFTER successful real payment
          try {
            await verifyPaymentAndCreateOrder({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              items: orderPayloadItems,
              notes,
            });

            clearCart();
            setShowPaymentModal(false);
            toast.success('✅ Payment Successful! Order sent to Canteen Admin.', {
              duration: 5000,
              style: { background: '#1a1a2e', color: '#34d399', border: '1px solid #34d399' },
            });
            navigate('/orders');
          } catch (vErr) {
            toast.error(vErr.response?.data?.message || '❌ Payment verification failed. Contact support.');
          }
        },
        prefill: {
          name: user?.name || 'Canteen Customer',
          email: user?.email || 'customer@canteen.com',
          contact: user?.phone || '9876543210',
        },
        theme: { color: '#f97316' },
        modal: {
          ondismiss: () => {
            // User closed the popup without paying — do NOT create any order
            setProcessingPayment(false);
            toast('Payment cancelled. No money was deducted.', { icon: 'ℹ️' });
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      setProcessingPayment(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to connect to payment gateway. Try again.');
      setProcessingPayment(false);
    }
  };


  if (cartItems.length === 0) {
    return (
      <div className="cart-page empty-cart-page" id="empty-cart">
        <div className="empty-cart-card">
          <FiShoppingBag className="empty-cart-icon" />
          <h2>Your Cart is Empty</h2>
          <p>Explore our canteen menu and add some delicious items!</p>
          <Link to="/" className="browse-menu-btn" id="browse-menu-btn">
            Browse Menu <FiArrowRight />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page" id="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h2>Your Shopping Cart ({cartItems.length} items)</h2>
          <button className="clear-cart-btn" onClick={clearCart} id="clear-cart-btn">
            <FiTrash2 /> Clear Cart
          </button>
        </div>

        <div className="cart-layout">
          {/* Item list */}
          <div className="cart-items-list">
            {cartItems.map((item) => (
              <div key={item._id} className="cart-item-card" id={`cart-item-${item._id}`}>
                <div className="cart-item-img">
                  {item.image ? (
                    <img src={item.image} alt={item.name} />
                  ) : (
                    <span>🍽️</span>
                  )}
                </div>

                <div className="cart-item-details">
                  <h4>{item.name}</h4>
                  <span className="cart-item-unit-price">₹{item.price} each</span>
                </div>

                <div className="cart-item-controls">
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    id={`qty-minus-${item._id}`}
                  >
                    <FiMinus />
                  </button>
                  <span className="qty-value">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    id={`qty-plus-${item._id}`}
                  >
                    <FiPlus />
                  </button>
                </div>

                <div className="cart-item-subtotal">
                  ₹{item.price * item.quantity}
                </div>

                <button
                  className="remove-item-btn"
                  onClick={() => removeFromCart(item._id)}
                  id={`remove-btn-${item._id}`}
                  title="Remove item"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary sidebar */}
          <div className="cart-summary-card">
            <h3>Order Summary</h3>

            <div className="summary-row">
              <span>Items Total</span>
              <span>₹{cartTotal}</span>
            </div>
            <div className="summary-row">
              <span>Canteen Taxes & Charges</span>
              <span className="free-tag">FREE</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row total-row">
              <span>Grand Total</span>
              <span>₹{cartTotal}</span>
            </div>

            <div className="form-group notes-group">
              <label htmlFor="order-notes">Special Instructions (Optional)</label>
              <textarea
                id="order-notes"
                placeholder="Extra spicy, less sauce, call when ready..."
                rows="3"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <button
              className="checkout-btn"
              id="checkout-btn"
              onClick={handleOpenPayment}
              disabled={loading}
            >
              <FiCreditCard /> Proceed to Pay ₹{cartTotal}
            </button>
          </div>
        </div>
      </div>

      {/* Real Payment Gateway Modal */}
      {showPaymentModal && (
        <div className="modal-overlay" onClick={() => !processingPayment && setShowPaymentModal(false)}>
          <div className="modal-card payment-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <FiLock style={{ color: '#34d399', marginRight: '6px' }} />
                Razorpay Bank & UPI Payment Gateway
              </h3>
            </div>

            <div className="payment-summary-box">
              <span>Amount to Pay:</span>
              <strong className="payment-amount">₹{cartTotal}</strong>
            </div>

            <div className="payment-method-selector">
              <label className={`payment-option ${paymentMethod === 'upi' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="upi"
                  checked={paymentMethod === 'upi'}
                  onChange={() => setPaymentMethod('upi')}
                />
                <span className="pay-icon">📱</span>
                <div>
                  <strong>UPI (GPay, PhonePe, Paytm, BHIM)</strong>
                  <p>Instant direct bank transfer from your phone app</p>
                </div>
              </label>

              <label className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                />
                <span className="pay-icon">💳</span>
                <div>
                  <strong>Debit / Credit Card & NetBanking</strong>
                  <p>Visa, MasterCard, RuPay & All Indian Banks</p>
                </div>
              </label>
            </div>

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowPaymentModal(false)}
                disabled={processingPayment}
              >
                Cancel
              </button>
              <button
                className="save-btn pay-now-btn"
                id="confirm-pay-btn"
                onClick={executeRazorpayGateway}
                disabled={processingPayment}
              >
                {processingPayment ? (
                  <span>Connecting to Bank Gateway...</span>
                ) : (
                  <>
                    <FiCheck /> Pay ₹{cartTotal} via Bank Gateway
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
