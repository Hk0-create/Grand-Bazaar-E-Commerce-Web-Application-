import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, CheckCircle, Clock, Truck, MessageSquare, Phone, 
  MapPin, ShoppingBag, CreditCard, ChevronRight 
} from 'lucide-react';
import api from '../../utils/api.js';
import logo from '../../assets/logo.png';
import ChatBox from '../../components/common/ChatBox.jsx';
import toast from 'react-hot-toast';

const OrderTrackingPage = () => {
  const { id } = useParams();
  const { user } = useSelector((s) => s.auth);
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);

  const fetchOrderDetails = async () => {
    try {
      const { data } = await api.get(`/orders/${id}`);
      setOrder(data.order);
    } catch (err) {
      toast.error('Failed to load tracking details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
    
    // Poll order status every 10 seconds to show updates
    const interval = setInterval(fetchOrderDetails, 10000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div className="spinner-gold" />
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ paddingTop: 120, textAlign: 'center', minHeight: '60vh' }}>
        <h3 style={{ color: 'var(--navy)' }}>Order Not Found</h3>
        <p className="text-muted mt-2">We couldn't find the tracking information for this order.</p>
        <Link to="/products" className="btn btn-gold mt-4">Go to Store</Link>
      </div>
    );
  }

  const steps = [
    { label: 'Order Placed', status: 'pending', icon: Clock },
    { label: 'Confirmed', status: 'confirmed', icon: CheckCircle },
    { label: 'Processing', status: 'processing', icon: Package },
    { label: 'Rider Dispatched', status: 'assigned', icon: Truck },
    { label: 'Out for Delivery', status: 'out_for_delivery', icon: Truck },
    { label: 'Delivered', status: 'delivered', icon: CheckCircle },
  ];

  const getStepIndex = (currentStatus) => {
    const map = {
      'pending': 0,
      'confirmed': 1,
      'processing': 2,
      'assigned': 3,
      'out_for_delivery': 4,
      'delivered': 5,
      'cancelled': -1
    };
    return map[currentStatus] ?? 0;
  };

  const currentStepIndex = getStepIndex(order.status);

  return (
    <div style={{ paddingTop: 120, paddingBottom: 80, minHeight: '100vh', background: 'var(--gray-50)' }}>
      <div className="container" style={{ maxWidth: 900 }}>
        
        {/* Navigation Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', marginBottom: 24 }}>
          <Link to="/" className="text-muted">Home</Link>
          <ChevronRight size={14} className="text-muted" />
          <span style={{ color: 'var(--navy)', fontWeight: 500 }}>Track Order #{order.orderNumber?.slice(-8).toUpperCase()}</span>
        </div>

        {/* Tracking Main Card */}
        <motion.div 
          className="card" 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 32 }}
        >
          <div className="card-body" style={{ padding: 40 }}>
            {/* Header info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, borderBottom: '1px solid var(--gray-100)', paddingBottom: 24 }}>
              <div>
                <small className="text-muted" style={{ display: 'block', textTransform: 'uppercase', letterSpacing: 1 }}>Order ID</small>
                <h3 style={{ color: 'var(--navy)', margin: '4px 0 0' }}>{order.orderNumber}</h3>
              </div>
              <div style={{ textAlign: 'right' }}>
                <small className="text-muted" style={{ display: 'block', textTransform: 'uppercase', letterSpacing: 1 }}>Order Status</small>
                <span className={`badge badge-${order.status === 'delivered' ? 'success' : order.status === 'cancelled' ? 'danger' : 'navy'}`} style={{ fontSize: '0.9rem', padding: '6px 16px', display: 'inline-block', marginTop: 6 }}>
                  {order.status?.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            {/* Timeline Progress */}
            {order.status === 'cancelled' ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--red)' }}>
                <h4>This order has been cancelled</h4>
                <p className="text-muted" style={{ marginTop: 8 }}>Please contact support if you have questions.</p>
              </div>
            ) : (
              <div style={{ padding: '40px 0 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', flexWrap: 'wrap', gap: 20 }}>
                  
                  {/* Progress Line */}
                  <div style={{
                    position: 'absolute', top: 22, left: '5%', right: '5%',
                    height: 4, background: 'var(--gray-200)', zIndex: 1,
                    display: 'block'
                  }}>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(currentStepIndex / 5) * 100}%` }}
                      transition={{ duration: 0.8 }}
                      style={{ height: '100%', background: 'var(--gold)' }}
                    />
                  </div>

                  {/* Steps */}
                  {steps.map((s, idx) => {
                    const StepIcon = s.icon;
                    const isCompleted = idx <= currentStepIndex;
                    const isActive = idx === currentStepIndex;
                    
                    return (
                      <div 
                        key={s.label}
                        style={{
                          display: 'flex', flexDirection: 'column', alignItems: 'center',
                          zIndex: 2, position: 'relative', width: '12%', minWidth: 80, textAlign: 'center'
                        }}
                      >
                        <motion.div 
                          animate={{ 
                            scale: isActive ? [1, 1.15, 1] : 1,
                            backgroundColor: isCompleted ? 'var(--gold)' : 'white',
                            borderColor: isCompleted ? 'var(--gold)' : 'var(--gray-300)'
                          }}
                          transition={{ repeat: isActive ? Infinity : 0, duration: 1.5 }}
                          style={{
                            width: 44, height: 44, borderRadius: '50%',
                            border: '3px solid',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: isCompleted ? 'white' : 'var(--gray-400)',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                          }}
                        >
                          <StepIcon size={20} />
                        </motion.div>
                        <span style={{ 
                          fontSize: '0.75rem', marginTop: 10, 
                          fontWeight: isActive ? 600 : 500,
                          color: isActive ? 'var(--navy)' : isCompleted ? 'var(--gray-700)' : 'var(--gray-400)'
                        }}>
                          {s.label}
                        </span>
                      </div>
                    );
                  })}

                </div>
              </div>
            )}
          </div>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: 30, alignItems: 'start' }}>
          
          {/* Order Details & Summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
            {/* Delivery details card */}
            <div className="card">
              <div className="card-body" style={{ padding: 30 }}>
                <h4 style={{ color: 'var(--navy)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <MapPin size={20} color="var(--gold)" /> Delivery Details
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <strong style={{ fontSize: '0.85rem', display: 'block', color: 'var(--gray-500)' }}>Recipient</strong>
                    <span style={{ fontSize: '1rem', color: 'var(--navy)', fontWeight: 600 }}>
                      {order.shippingAddress?.fullName}
                    </span>
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.85rem', display: 'block', color: 'var(--gray-500)' }}>Delivery Address</strong>
                    <span style={{ fontSize: '0.95rem', color: 'var(--gray-700)' }}>
                      {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}
                    </span>
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.85rem', display: 'block', color: 'var(--gray-500)' }}>Contact Phone</strong>
                    <span style={{ fontSize: '0.95rem', color: 'var(--gray-700)' }}>
                      {order.shippingAddress?.phone}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Summary card */}
            <div className="card">
              <div className="card-body" style={{ padding: 30 }}>
                <h4 style={{ color: 'var(--navy)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ShoppingBag size={20} color="var(--gold)" /> Order Items
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {order.items?.map((item) => (
                    <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <img 
                          src={item.image || '/logo.png'} 
                          alt="" 
                          style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 8 }} 
                        />
                        <div>
                          <strong style={{ fontSize: '0.9rem', color: 'var(--navy)', display: 'block' }}>{item.name}</strong>
                          <span style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>
                            Qty: {item.quantity} {item.color ? `· Color: ${item.color}` : ''} {item.size ? `· Size: ${item.size}` : ''}
                          </span>
                        </div>
                      </div>
                      <span style={{ fontWeight: 600, color: 'var(--navy)' }}>Rs. {item.price * item.quantity}</span>
                    </div>
                  ))}
                  
                  <div style={{ borderTop: '1px solid var(--gray-100)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--gray-500)' }}>
                      <span>Subtotal</span>
                      <span>Rs. {order.itemsPrice}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--gray-500)' }}>
                      <span>Delivery Charges</span>
                      <span>Rs. {order.deliveryCharges}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: 'var(--navy)', fontSize: '1.05rem', borderTop: '1px solid var(--gray-100)', paddingTop: 8 }}>
                      <span>Total Amount</span>
                      <span>Rs. {order.totalPrice}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Area: Rider Info & Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
            
            {/* Rider Details Panel */}
            {order.rider ? (
              <motion.div 
                className="card"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  border: '1px solid rgba(201, 168, 76, 0.3)',
                  boxShadow: '0 4px 15px rgba(201, 168, 76, 0.05)'
                }}
              >
                <div className="card-body" style={{ padding: 24, textAlign: 'center' }}>
                  <span className="badge badge-success mb-3" style={{ fontSize: '0.75rem' }}>Rider Assigned</span>
                  
                  <div className="nav-avatar-placeholder" style={{ width: 64, height: 64, fontSize: '1.5rem', margin: '0 auto 12px', background: 'var(--navy)' }}>
                    {order.rider.name?.charAt(0)}
                  </div>

                  <h5 style={{ color: 'var(--navy)', margin: 0 }}>{order.rider.name}</h5>
                  <p style={{ color: 'var(--gold-dark)', fontSize: '0.85rem', marginTop: 4, fontWeight: 500 }}>Your Delivery Partner</p>

                  <div 
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      margin: '16px 0', fontSize: '0.9rem', color: 'var(--gray-600)'
                    }}
                  >
                    <Phone size={14} /> <span>{order.rider.phone || 'No phone provided'}</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
                    <button 
                      onClick={() => setShowChat(true)}
                      className="btn btn-gold" 
                      style={{ width: '100%', justifyContent: 'center', gap: 8 }}
                    >
                      <MessageSquare size={16} /> Chat with Rider
                    </button>
                    {order.rider.phone && (
                      <a 
                        href={`tel:${order.rider.phone}`}
                        className="btn btn-outline" 
                        style={{ width: '100%', justifyContent: 'center', gap: 8 }}
                      >
                        <Phone size={16} /> Call Partner
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="card" style={{ padding: 24, textAlign: 'center', background: 'var(--gray-50)', border: 'none' }}>
                <Clock size={40} className="text-muted" style={{ margin: '0 auto 12px' }} />
                <h5 style={{ color: 'var(--navy)', margin: 0 }}>Assigning Partner</h5>
                <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: 6 }}>
                  Once the store prepares your items, a delivery rider will be assigned and shown here.
                </p>
              </div>
            )}

            {/* Payment Summary */}
            <div className="card">
              <div className="card-body" style={{ padding: 24 }}>
                <h5 style={{ color: 'var(--navy)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CreditCard size={18} color="var(--gold)" /> Payment Info
                </h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="text-muted">Method:</span>
                    <strong style={{ textTransform: 'uppercase' }}>{order.paymentMethod}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="text-muted">Status:</span>
                    <span className={`badge badge-${order.paymentStatus === 'paid' ? 'success' : 'warning'}`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Real-time Customer-Rider Chat Box */}
      <AnimatePresence>
        {showChat && order.rider && (
          <ChatBox 
            orderId={order._id}
            recipientName={order.rider.name}
            recipientRole="rider"
            currentUser={user}
            onClose={() => setShowChat(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderTrackingPage;
