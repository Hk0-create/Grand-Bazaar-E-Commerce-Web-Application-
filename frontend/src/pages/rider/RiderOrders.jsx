import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Truck, CheckCircle2, MessageSquare, Phone, MapPin, DollarSign, LogOut, ArrowLeft } from 'lucide-react';
import { logoutUser } from '../../store/slices/authSlice.js';
import api from '../../utils/api.js';
import logo from '../../assets/logo.png';
import ChatBox from '../../components/common/ChatBox.jsx';
import toast from 'react-hot-toast';

const RiderOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChatOrderId, setActiveChatOrderId] = useState(null);
  const [activeChatRecipient, setActiveChatRecipient] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/orders/rider-orders');
      setOrders(data.orders || []);
    } catch (err) {
      toast.error('Failed to load assigned orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/admin/login');
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order marked as ${newStatus.replace(/_/g, ' ')}!`);
      // Update local state
      setOrders((prev) => 
        prev.map((o) => o._id === orderId ? { ...o, status: newStatus } : o)
      );
    } catch (err) {
      toast.error('Failed to update order status');
    }
  };

  const activeOrders = orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled');
  const completedOrders = orders.filter((o) => o.status === 'delivered');

  return (
    <div className="admin-layout">
      {/* Rider Sidebar */}
      <div className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <img src={logo} alt="Grand Bazaar" />
          <span>Rider Panel</span>
        </div>
        <nav className="admin-nav">
          <a href="/rider" className="admin-nav-link"><Package size={18} /> Dashboard</a>
          <a href="/rider/orders" className="admin-nav-link active" style={{ backgroundColor: 'rgba(201,168,76,0.15)', color: 'var(--gold)' }}><Package size={18} /> My Orders</a>
          <button onClick={handleLogout} className="admin-nav-link admin-logout-btn">
            <LogOut size={18} /> Logout
          </button>
        </nav>
        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="nav-avatar-placeholder">{user?.name?.charAt(0)}</div>
            <div>
              <p>{user?.name}</p>
              <small>Rider</small>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-main">
        <div className="admin-header">
          <div>
            <h2>My Delivery Tasks</h2>
            <p className="text-muted">Manage active deliveries, access addresses, and communicate with customers.</p>
          </div>
          <a href="/rider" className="btn btn-outline btn-sm" style={{ gap: 6 }}>
            <ArrowLeft size={14} /> Back to Dashboard
          </a>
        </div>

        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>
            <div className="spinner-gold" />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }} className="mt-6">
            
            {/* Active Deliveries */}
            <div>
              <h4 style={{ color: 'var(--navy)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Truck size={20} color="var(--gold)" />
                Active Deliveries ({activeOrders.length})
              </h4>
              
              {activeOrders.length === 0 ? (
                <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--gray-400)' }}>
                  <Package size={48} strokeWidth={1} style={{ margin: '0 auto 12px' }} />
                  <p>You have no active delivery tasks currently.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: 20 }}>
                  {activeOrders.map((o) => (
                    <motion.div 
                      key={o._id} 
                      className="card"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -3 }}
                    >
                      <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {/* Title / Order ID */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span className="order-num" style={{ fontSize: '1.05rem' }}>{o.orderNumber}</span>
                          <span className={`badge badge-navy`} style={{ textTransform: 'capitalize' }}>
                            {o.status.replace(/_/g, ' ')}
                          </span>
                        </div>

                        {/* Customer Info */}
                        <div style={{ padding: '12px 16px', background: 'var(--gray-50)', borderRadius: 12 }}>
                          <h6 style={{ marginBottom: 6, color: 'var(--navy)' }}>Customer</h6>
                          <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{o.user?.name}</div>
                          <div className="text-muted" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                            <Phone size={12} /> {o.shippingAddress?.phone || o.user?.phone || 'No phone'}
                          </div>
                        </div>

                        {/* Delivery Info */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                            <MapPin size={16} color="var(--gold-dark)" style={{ marginTop: 2, flexShrink: 0 }} />
                            <div>
                              <strong style={{ fontSize: '0.85rem', display: 'block', color: 'var(--navy)' }}>Delivery Address</strong>
                              <span style={{ fontSize: '0.85rem', color: 'var(--gray-600)' }}>
                                {o.shippingAddress?.street}, {o.shippingAddress?.city}, {o.shippingAddress?.state} {o.shippingAddress?.postalCode}
                              </span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <DollarSign size={16} color="#16a34a" style={{ flexShrink: 0 }} />
                            <div>
                              <span style={{ fontSize: '0.85rem' }}>
                                Total Amount: <strong>Rs. {o.totalPrice?.toLocaleString()}</strong>
                              </span>
                              <span className="text-muted" style={{ fontSize: '0.8rem', marginLeft: 8 }}>
                                ({o.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid online'})
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Items list summary */}
                        <div style={{ borderTop: '1px solid var(--gray-100)', pt: 12 }}>
                          <small className="text-muted" style={{ display: 'block', marginBottom: 6 }}>Items to deliver:</small>
                          {o.items?.map((item) => (
                            <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginTop: 4 }}>
                              <span>{item.name} <strong>x{item.quantity}</strong></span>
                              <span className="text-muted">Rs. {item.price}</span>
                            </div>
                          ))}
                        </div>

                        {/* Actions Panel */}
                        <div style={{ display: 'flex', gap: 10, borderTop: '1px solid var(--gray-100)', paddingTop: 16 }}>
                          {o.status === 'assigned' && (
                            <button 
                              className="btn btn-gold btn-sm"
                              style={{ flex: 1, justifyContent: 'center' }}
                              onClick={() => handleUpdateStatus(o._id, 'out_for_delivery')}
                            >
                              <Truck size={14} /> Start Delivery
                            </button>
                          )}
                          
                          {o.status === 'out_for_delivery' && (
                            <button 
                              className="btn btn-gold btn-sm"
                              style={{ flex: 1, justifyContent: 'center', background: '#16a34a', borderColor: '#16a34a' }}
                              onClick={() => handleUpdateStatus(o._id, 'delivered')}
                            >
                              <CheckCircle2 size={14} /> Mark Delivered
                            </button>
                          )}

                          <button 
                            className="btn btn-outline btn-sm"
                            style={{ flex: 1, justifyContent: 'center', gap: 6 }}
                            onClick={() => {
                              setActiveChatOrderId(o._id);
                              setActiveChatRecipient(o.user);
                            }}
                          >
                            <MessageSquare size={14} /> Chat with Customer
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Completed Deliveries */}
            <div>
              <h4 style={{ color: 'var(--navy)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={20} color="#16a34a" />
                Completed Deliveries ({completedOrders.length})
              </h4>
              
              {completedOrders.length === 0 ? (
                <p className="text-muted">No completed delivery runs yet.</p>
              ) : (
                <div className="card">
                  <div className="card-body orders-table-wrap">
                    <table className="orders-table">
                      <thead>
                        <tr>
                          <th>Order #</th>
                          <th>Customer</th>
                          <th>Delivery Address</th>
                          <th>Total Amount</th>
                          <th>Delivered Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {completedOrders.map((o) => (
                          <tr key={o._id}>
                            <td><span className="order-num">{o.orderNumber}</span></td>
                            <td>{o.user?.name}</td>
                            <td>{o.shippingAddress?.city}</td>
                            <td>Rs. {o.totalPrice?.toLocaleString()}</td>
                            <td>{new Date(o.updatedAt).toLocaleDateString()}</td>
                            <td>
                              <button 
                                className="btn btn-ghost btn-sm"
                                style={{ gap: 4 }}
                                onClick={() => {
                                  setActiveChatOrderId(o._id);
                                  setActiveChatRecipient(o.user);
                                }}
                              >
                                <MessageSquare size={12} /> Chat History
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}
      </div>

      {/* Embedded Real-time Chat Box */}
      <AnimatePresence>
        {activeChatOrderId && activeChatRecipient && (
          <ChatBox 
            orderId={activeChatOrderId}
            recipientName={activeChatRecipient.name}
            recipientRole="customer"
            currentUser={user}
            onClose={() => {
              setActiveChatOrderId(null);
              setActiveChatRecipient(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default RiderOrders;
