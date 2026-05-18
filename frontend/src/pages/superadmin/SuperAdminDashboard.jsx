import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Package, TrendingUp, ShoppingBag, CheckCircle, AlertCircle, LogOut } from 'lucide-react';
import { logoutUser } from '../../store/slices/authSlice.js';
import logo from '../../assets/logo.png';
import api from '../../utils/api.js';
import '../admin/AdminDashboard.css';

const SuperAdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalRiders: 0,
    totalProducts: 0,
    pendingProducts: 0,
    pendingAdmins: 0,
    pendingRiders: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/admin/login');
  };

  useEffect(() => {
    api.get('/superadmin/stats')
      .then((r) => {
        setStats(r.data.stats || {});
        
        // Format Monthly Sales chart data
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const formattedChart = (r.data.monthlySales || []).map((s) => ({
          month: monthNames[s._id.month - 1],
          revenue: s.revenue
        }));

        // Fill in active months if empty so charts display beautifully
        if (formattedChart.length === 0) {
          for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            formattedChart.push({
              month: monthNames[d.getMonth()],
              revenue: 0
            });
          }
        }
        
        setChartData(formattedChart);
      })
      .catch((err) => {
        console.error("Failed to load superadmin stats", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const links = [
    ['Dashboard', '/superadmin', TrendingUp],
    ['Users', '/superadmin/users', Users],
    ['Approvals', '/superadmin/approvals', CheckCircle],
  ];

  const totalPlatformUsers = stats.totalUsers + stats.totalAdmins + stats.totalRiders;
  const totalPendingApprovals = stats.pendingProducts + stats.pendingAdmins + stats.pendingRiders;

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <img src={logo} alt="Grand Bazaar" />
          <span>Super Admin</span>
        </div>
        <nav className="admin-nav">
          {links.map(([label, path, Icon]) => (
            <a key={path} href={path} className="admin-nav-link"><Icon size={18} /> {label}</a>
          ))}
          <button onClick={handleLogout} className="admin-nav-link admin-logout-btn">
            <LogOut size={18} /> Logout
          </button>
        </nav>
        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="nav-avatar-placeholder" style={{ background: 'linear-gradient(135deg,#C9A84C,#a8862e)' }}>{user?.name?.charAt(0)}</div>
            <div><p>{user?.name}</p><small>Super Admin</small></div>
          </div>
        </div>
      </div>
      
      <div className="admin-main">
        <div className="admin-header">
          <div>
            <h2>Super Admin Dashboard</h2>
            <p className="text-muted">Platform overview and management</p>
          </div>
          <img src={logo} alt="Grand Bazaar" className="admin-header-logo" />
        </div>

        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>
            <div className="spinner-gold" />
          </div>
        ) : (
          <>
            <div className="stats-grid">
              {[
                ['Total Users', totalPlatformUsers.toLocaleString(), Users, 'linear-gradient(135deg,#0D1B3E,#1a2f5e)'],
                ['Total Revenue', `Rs. ${stats.totalRevenue.toLocaleString()}`, TrendingUp, 'linear-gradient(135deg,#C9A84C,#a8862e)'],
                ['Pending Approvals', totalPendingApprovals.toLocaleString(), AlertCircle, 'linear-gradient(135deg,#d97706,#b45309)'],
                ['Approved Products', stats.totalProducts.toLocaleString(), ShoppingBag, 'linear-gradient(135deg,#16a34a,#15803d)'],
              ].map(([label, val, Icon, color]) => (
                <motion.div key={label} className="stat-card" whileHover={{ y: -4 }}>
                  <div className="stat-card-icon" style={{ background: color }}><Icon size={24} color="white" /></div>
                  <div><p className="stat-label">{label}</p><h3 className="stat-value">{val}</h3></div>
                </motion.div>
              ))}
            </div>

            <div className="card mt-6 card-body">
              <h4 style={{ marginBottom: 20 }}>Platform Revenue (Last 6 Months)</h4>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#C9A84C" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(v) => `Rs. ${v.toLocaleString()}`} />
                  <Area type="monotone" dataKey="revenue" stroke="#C9A84C" strokeWidth={2} fill="url(#gold)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
