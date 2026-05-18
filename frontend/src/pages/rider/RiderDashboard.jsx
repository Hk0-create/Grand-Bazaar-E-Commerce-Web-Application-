import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Star, MessageCircle, TrendingUp, LogOut, Truck } from 'lucide-react';
import { logoutUser } from '../../store/slices/authSlice.js';
import api from '../../utils/api.js';
import logo from '../../assets/logo.png';
import '../admin/AdminDashboard.css';
import { AdminSidebar } from '../admin/AdminDashboard.jsx';

const RiderDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const [orders, setOrders] = useState([]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/admin/login');
  };

  useEffect(() => { api.get('/orders/rider-orders').then((r) => setOrders(r.data.orders || [])); }, []);

  return (
    <div className="admin-layout">
      {/* Rider sidebar */}
      <div className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <img src={logo} alt="Grand Bazaar" />
          <span>Rider Panel</span>
        </div>
        <nav className="admin-nav">
          {[['Dashboard', '/rider', Package], ['My Orders', '/rider/orders', Package], ['Reviews', '/rider/reviews', Star]].map(([label, path, Icon]) => (
            <a key={path} href={path} className="admin-nav-link"><Icon size={18} /> {label}</a>
          ))}
          <button onClick={handleLogout} className="admin-nav-link admin-logout-btn">
            <LogOut size={18} /> Logout
          </button>
        </nav>
        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="nav-avatar-placeholder">{user?.name?.charAt(0)}</div>
            <div><p>{user?.name}</p><small>Rider</small></div>
          </div>
        </div>
      </div>
      <div className="admin-main">
        <h2 style={{ color: 'var(--navy)', marginBottom: 8 }}>Welcome, {user?.name?.split(' ')[0]}!</h2>
        <p className="text-muted mb-6">Your active deliveries and tasks.</p>

        {/* Assigned Order Notification Banner */}
        {orders.some((o) => o.status === 'assigned') && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="card mb-6" 
            style={{
              background: 'linear-gradient(135deg, var(--navy), #1a2f5e)',
              color: 'white', border: '1px solid var(--gold)',
              boxShadow: '0 8px 30px rgba(201, 168, 76, 0.2)'
            }}
          >
            <div className="card-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  background: 'var(--gold)', borderRadius: '50%', width: 44, height: 44,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(201,168,76,0.3)'
                }}>
                  <Truck size={22} color="var(--navy)" />
                </div>
                <div>
                  <h4 style={{ color: 'white', margin: 0, fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                    New Delivery Assigned!
                  </h4>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', margin: '4px 0 0' }}>
                    You have a new delivery task pending. Go to My Orders to get delivery details and start.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/rider/orders')} 
                className="btn btn-gold btn-sm" 
                style={{ padding: '8px 16px', fontWeight: 600 }}
              >
                Go to Deliveries
              </button>
            </div>
          </motion.div>
        )}

        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {[['Active Orders', orders.filter((o) => o.status !== 'delivered').length, Package],
            ['Delivered', orders.filter((o) => o.status === 'delivered').length, TrendingUp],
            ['Reviews', '0', Star]].map(([label, val, Icon]) => (
            <motion.div key={label} className="stat-card" whileHover={{ y: -4 }}>
              <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg,#C9A84C,#a8862e)' }}><Icon size={24} color="white" /></div>
              <div><p className="stat-label">{label}</p><h3 className="stat-value">{val}</h3></div>
            </motion.div>
          ))}
        </div>
        <div className="card mt-6"><div className="card-body">
          <h4 style={{ marginBottom: 16 }}>Assigned Orders</h4>
          {orders.length === 0 ? <p className="text-muted">No orders assigned yet.</p> : (
            orders.slice(0, 5).map((o) => (
              <div key={o._id} style={{ padding: '12px 0', borderBottom: '1px solid var(--gray-100)' }}>
                <p style={{ fontWeight: 600, color: 'var(--navy)' }}>{o.orderNumber}</p>
                <p className="text-muted" style={{ fontSize: '0.85rem' }}>{o.user?.name} · {o.shippingAddress?.city}</p>
                <span className={`badge badge-${o.status === 'delivered' ? 'success' : 'navy'}`}>{o.status}</span>
              </div>
            ))
          )}
        </div></div>
      </div>
    </div>
  );
};

export default RiderDashboard;
