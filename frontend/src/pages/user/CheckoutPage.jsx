import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, User, CreditCard, Truck, ShoppingBag, ChevronRight, CheckCircle } from 'lucide-react';
import { createOrder } from '../../store/slices/orderSlice.js';
import { clearCart } from '../../store/slices/cartSlice.js';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalAmount } = useSelector((s) => s.cart);
  const { user } = useSelector((s) => s.auth);
  const { loading } = useSelector((s) => s.orders);
  
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    }
  });

  const deliveryCharges = items.reduce((acc, item) => acc + (item.product.deliveryCharges || 0), 0);
  const finalTotal = totalAmount + deliveryCharges;

  if (items.length === 0) return <Navigate to="/products" />;

  const onSubmit = async (data) => {
    const orderData = {
      shippingAddress: data,
      paymentMethod,
    };
    
    const result = await dispatch(createOrder(orderData));
    if (createOrder.fulfilled.match(result)) {
      dispatch(clearCart());
      navigate(`/order-success/${result.payload._id}`);
    }
  };

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-header">
          <h1>Secure Checkout</h1>
          <div className="checkout-steps">
            <span className="step active">Cart</span>
            <ChevronRight size={16} />
            <span className="step active">Shipping</span>
            <ChevronRight size={16} />
            <span className="step">Payment</span>
          </div>
        </div>

        <div className="checkout-grid">
          {/* Left Side: Form */}
          <div className="checkout-main">
            <form id="checkout-form" onSubmit={handleSubmit(onSubmit)}>
              <div className="checkout-section card">
                <div className="section-header">
                  <MapPin size={20} />
                  <h3>Shipping Address</h3>
                </div>
                <div className="form-grid">
                  <div className="form-group full">
                    <label>Full Name</label>
                    <div className="input-wrap">
                      <User size={18} />
                      <input {...register('name', { required: 'Name is required' })} placeholder="Full Name" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <div className="input-wrap">
                      <Mail size={18} />
                      <input {...register('email', { required: 'Email is required' })} placeholder="Email" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <div className="input-wrap">
                      <Phone size={18} />
                      <input {...register('phone', { required: 'Phone is required' })} placeholder="Phone" />
                    </div>
                  </div>
                  <div className="form-group full">
                    <label>Street Address</label>
                    <div className="input-wrap">
                      <MapPin size={18} />
                      <input {...register('address', { required: 'Address is required' })} placeholder="House #, Street, Area" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>City</label>
                    <input className="simple-input" {...register('city', { required: 'City is required' })} placeholder="City" />
                  </div>
                  <div className="form-group">
                    <label>Postal Code</label>
                    <input className="simple-input" {...register('zipCode')} placeholder="Postal Code" />
                  </div>
                </div>
              </div>

              <div className="checkout-section card">
                <div className="section-header">
                  <CreditCard size={20} />
                  <h3>Payment Method</h3>
                </div>
                <div className="payment-options">
                  <label className={`payment-option ${paymentMethod === 'cod' ? 'active' : ''}`}>
                    <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                    <div className="option-content">
                      <Truck size={24} />
                      <div>
                        <strong>Cash on Delivery</strong>
                        <p>Pay when you receive the package</p>
                      </div>
                    </div>
                    {paymentMethod === 'cod' && <CheckCircle className="check-icon" size={20} />}
                  </label>
                  
                  <label className={`payment-option ${paymentMethod === 'stripe' ? 'active' : ''}`}>
                    <input type="radio" name="payment" value="stripe" checked={paymentMethod === 'stripe'} onChange={() => setPaymentMethod('stripe')} />
                    <div className="option-content">
                      <CreditCard size={24} />
                      <div>
                        <strong>Credit/Debit Card</strong>
                        <p>Secure online payment via Stripe</p>
                      </div>
                    </div>
                    {paymentMethod === 'stripe' && <CheckCircle className="check-icon" size={20} />}
                  </label>
                </div>
              </div>
            </form>
          </div>

          {/* Right Side: Summary */}
          <div className="checkout-sidebar">
            <div className="order-summary card">
              <div className="section-header">
                <ShoppingBag size={20} />
                <h3>Order Summary</h3>
              </div>
              <div className="summary-items">
                {items.map((item) => (
                  <div key={item._id} className="summary-item">
                    <img src={item.product.images?.[0] || '/logo.png'} alt={item.product.name} />
                    <div className="item-info">
                      <h6>{item.product.name}</h6>
                      <p>Qty: {item.quantity} · {item.color}, {item.size}</p>
                      <span className="item-price">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="summary-totals">
                <div className="total-row">
                  <span>Subtotal</span>
                  <span>Rs. {totalAmount.toLocaleString()}</span>
                </div>
                <div className="total-row">
                  <span>Delivery Charges</span>
                  <span>Rs. {deliveryCharges.toLocaleString()}</span>
                </div>
                <div className="total-row grand-total">
                  <span>Total</span>
                  <span>Rs. {finalTotal.toLocaleString()}</span>
                </div>
              </div>
              <motion.button 
                form="checkout-form"
                type="submit" 
                className="btn btn-gold btn-large" 
                disabled={loading}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? 'Processing...' : `Place Order · Rs. ${finalTotal.toLocaleString()}`}
              </motion.button>
              <p className="secure-text"><ShieldCheck size={14} /> Secure SSL Encrypted Checkout</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShieldCheck = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export default CheckoutPage;
