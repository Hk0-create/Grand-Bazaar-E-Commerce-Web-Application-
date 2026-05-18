import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Users, ShoppingBag, TrendingUp, Clock, CheckCircle, AlertCircle, Star, LogOut } from 'lucide-react';
import { logoutUser } from '../../store/slices/authSlice.js';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import api from '../../utils/api.js';
import logo from '../../assets/logo.png';
import './AdminDashboard.css';

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <motion.div className="stat-card" whileHover={{ y: -4 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
    <div className="stat-card-icon" style={{ background: color }}>
      <Icon size={24} color="white" />
    </div>
    <div className="stat-card-info">
      <p className="stat-label">{title}</p>
      <h3 className="stat-value">{value}</h3>
      {trend && <span className="stat-trend">↑ {trend}</span>}
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const { user } = useSelector((s) => s.auth);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    pendingProducts: 0,
    totalCustomers: 0,
    totalRevenue: 0
  });
  const [orders, setOrders] = useState([]);
  const [revenueChart, setRevenueChart] = useState([]);
  const [statusChart, setStatusChart] = useState([]);

  useEffect(() => {
    api.get('/orders?limit=5').then((r) => setOrders(r.data.orders || []));
    api.get('/admin/stats').then((r) => {
      setStats(r.data.stats || { totalOrders: 0, totalProducts: 0, pendingProducts: 0, totalCustomers: 0, totalRevenue: 0 });
      setRevenueChart(r.data.monthlySales || []);
      const counts = r.data.statusCounts || {};
      setStatusChart([
        { status: 'Pending', count: counts.pending || 0 },
        { status: 'Confirmed', count: counts.confirmed || 0 },
        { status: 'Processing', count: counts.processing || 0 },
        { status: 'Assigned', count: (counts.assigned || 0) + (counts.out_for_delivery || 0) },
        { status: 'Delivered', count: counts.delivered || 0 },
        { status: 'Cancelled', count: counts.cancelled || 0 }
      ]);
    }).catch(() => {});
  }, []);

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <div className="admin-header">
          <div>
            <h2>Welcome back, {user?.name?.split(' ')[0]}!</h2>
            <p className="text-muted">Here's what's happening today.</p>
          </div>
          <img src={logo} alt="Grand Bazaar" className="admin-header-logo" />
        </div>

        <div className="stats-grid">
          <StatCard title="Total Orders" value={stats.totalOrders.toLocaleString()} icon={Package} color="linear-gradient(135deg,#0D1B3E,#1a2f5e)" trend="Live count" />
          <StatCard title="Products" value={stats.totalProducts.toLocaleString()} icon={ShoppingBag} color="linear-gradient(135deg,#C9A84C,#a8862e)" trend={`${stats.pendingProducts} pending`} />
          <StatCard title="Customers" value={stats.totalCustomers.toLocaleString()} icon={Users} color="linear-gradient(135deg,#16a34a,#15803d)" trend="Active users" />
          <StatCard title="Revenue" value={`Rs. ${stats.totalRevenue.toLocaleString()}`} icon={TrendingUp} color="linear-gradient(135deg,#7c3aed,#5b21b6)" trend="Paid orders total" />
        </div>

        <div className="admin-charts-grid">
          <div className="card">
            <div className="card-body">
              <h4 style={{ marginBottom: 24 }}>Monthly Revenue</h4>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={revenueChart}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#C9A84C" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v) => `Rs. ${v.toLocaleString()}`} />
                  <Area type="monotone" dataKey="revenue" stroke="#C9A84C" strokeWidth={2} fill="url(#revGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h4 style={{ marginBottom: 24 }}>Orders by Status</h4>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={statusChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="status" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0D1B3E" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="card mt-6">
          <div className="card-body">
            <div className="flex flex-between mb-4">
              <h4>Recent Orders</h4>
              <a href="/admin/orders" className="btn btn-ghost btn-sm">View All</a>
            </div>
            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--gray-400)' }}>
                <Package size={48} strokeWidth={1} style={{ margin: '0 auto 12px' }} />
                <p>No orders yet</p>
              </div>
            ) : (
              <div className="orders-table-wrap">
                <table className="orders-table">
                  <thead>
                    <tr><th>Order #</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o._id}>
                        <td><span className="order-num">{o.orderNumber}</span></td>
                        <td>{o.user?.name}</td>
                        <td>Rs. {o.totalPrice?.toLocaleString()}</td>
                        <td><span className={`badge badge-${o.status === 'delivered' ? 'success' : o.status === 'cancelled' ? 'danger' : 'navy'}`}>{o.status}</span></td>
                        <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Admin Sidebar
const AdminSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/admin/login');
  };
  const links = [
    { label: 'Dashboard', path: '/admin', icon: TrendingUp },
    { label: 'Products', path: '/admin/products', icon: ShoppingBag },
    { label: 'Add Product', path: '/admin/products/add', icon: Package },
    { label: 'Orders', path: '/admin/orders', icon: Package },
    { label: 'Riders', path: '/admin/riders', icon: Users },
  ];

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-logo">
        <img src={logo} alt="Grand Bazaar" />
        <span>Admin Panel</span>
      </div>
      <nav className="admin-nav">
        {links.map((l) => (
          <a key={l.path} href={l.path} className="admin-nav-link">
            <l.icon size={18} /> {l.label}
          </a>
        ))}
        <button onClick={handleLogout} className="admin-nav-link admin-logout-btn">
          <LogOut size={18} /> Logout
        </button>
      </nav>
      <div className="admin-sidebar-footer">
        <div className="admin-user-info">
          <div className="nav-avatar-placeholder">{user?.name?.charAt(0)}</div>
          <div>
            <p>{user?.name}</p>
            <small>{user?.role}</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export { AdminSidebar };
export default AdminDashboard;
