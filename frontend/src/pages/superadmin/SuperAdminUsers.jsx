import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, UserCheck, ShieldAlert, Ban, Unlock, 
  Search, Filter, LogOut, CheckCircle, TrendingUp 
} from 'lucide-react';
import { logoutUser } from '../../store/slices/authSlice.js';
import logo from '../../assets/logo.png';
import api from '../../utils/api.js';
import toast from 'react-hot-toast';
import '../admin/AdminDashboard.css';

const SuperAdminUsers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/superadmin/users?limit=100');
      setUsers(data.users || []);
    } catch (err) {
      toast.error('Failed to load user directories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/admin/login');
  };

  const handleBlockToggle = async (userId, currentBlockedStatus) => {
    try {
      const newStatus = !currentBlockedStatus;
      await api.patch(`/superadmin/users/${userId}/block`, { blocked: newStatus });
      toast.success(newStatus ? 'User blocked successfully!' : 'User unblocked successfully!');
      
      // Update local state
      setUsers((prev) => 
        prev.map((u) => u._id === userId ? { ...u, isBlocked: newStatus } : u)
      );
    } catch (err) {
      toast.error('Failed to perform block operation');
    }
  };

  const handleApproveToggle = async (userId, currentApprovedStatus) => {
    try {
      const newStatus = !currentApprovedStatus;
      await api.patch(`/superadmin/users/${userId}/approve`, { approved: newStatus });
      toast.success(newStatus ? 'User approved successfully!' : 'User approval revoked!');
      
      // Update local state
      setUsers((prev) => 
        prev.map((u) => u._id === userId ? { ...u, isApproved: newStatus } : u)
      );
    } catch (err) {
      toast.error('Failed to toggle approval status');
    }
  };

  // Filter & Search Logic
  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole === 'all' || u.role === selectedRole;
    
    return matchesSearch && matchesRole;
  });

  const links = [
    ['Dashboard', '/superadmin', TrendingUp],
    ['Users', '/superadmin/users', Users],
    ['Approvals', '/superadmin/approvals', CheckCircle],
  ];

  return (
    <div className="admin-layout">
      {/* Super Admin Sidebar */}
      <div className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <img src={logo} alt="Grand Bazaar" />
          <span>Super Admin</span>
        </div>
        <nav className="admin-nav">
          {links.map(([label, path, Icon]) => (
            <a 
              key={path} 
              href={path} 
              className={`admin-nav-link ${path === '/superadmin/users' ? 'active' : ''}`}
              style={path === '/superadmin/users' ? { backgroundColor: 'rgba(201,168,76,0.15)', color: 'var(--gold)' } : {}}
            >
              <Icon size={18} /> {label}
            </a>
          ))}
          <button onClick={handleLogout} className="admin-nav-link admin-logout-btn">
            <LogOut size={18} /> Logout
          </button>
        </nav>
        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="nav-avatar-placeholder" style={{ background: 'linear-gradient(135deg,#C9A84C,#a8862e)' }}>
              {user?.name?.charAt(0)}
            </div>
            <div>
              <p>{user?.name}</p>
              <small>Super Admin</small>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-main">
        {/* Header */}
        <div className="admin-header">
          <div>
            <h2>User Directories</h2>
            <p className="text-muted">Monitor registry databases, adjust security status, and oversee authorizations.</p>
          </div>
          <div className="stat-badge" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Users size={16} />
            <span>Total Accounts: {users.length}</span>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="card mt-6" style={{ marginBottom: 24 }}>
          <div className="card-body" style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', flex: 1, minWidth: 250 }}>
              <Search 
                size={18} 
                style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} 
              />
              <input 
                type="text" 
                placeholder="Search account name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%', padding: '10px 16px 10px 42px', borderRadius: 12,
                  border: '1px solid var(--gray-200)', outline: 'none', background: 'var(--gray-50)',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            {/* Filter Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Filter size={18} className="text-muted" />
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                style={{
                  padding: '10px 16px', borderRadius: 12, border: '1px solid var(--gray-200)',
                  background: 'white', cursor: 'pointer', outline: 'none', fontSize: '0.9rem'
                }}
              >
                <option value="all">All Roles</option>
                <option value="user">Customer</option>
                <option value="admin">Admin</option>
                <option value="rider">Rider</option>
                <option value="superadmin">Super Admin</option>
              </select>
            </div>
          </div>
        </div>

        {/* User Table Grid */}
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '40vh' }}>
            <div className="spinner-gold" />
          </div>
        ) : (
          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="card-body orders-table-wrap">
              {filteredUsers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--gray-400)' }}>
                  <Users size={48} strokeWidth={1} style={{ margin: '0 auto 12px' }} />
                  <p>No user accounts match your search filters.</p>
                </div>
              ) : (
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Account Name</th>
                      <th>Email Registry</th>
                      <th>System Role</th>
                      <th>Approval Status</th>
                      <th>Security Status</th>
                      <th>Joined Date</th>
                      <th>Administrative Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u._id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div className="nav-avatar-placeholder" style={{ margin: 0 }}>
                              {u.name?.charAt(0)}
                            </div>
                            <strong style={{ color: 'var(--navy)' }}>{u.name}</strong>
                          </div>
                        </td>
                        <td>{u.email}</td>
                        <td>
                          <span 
                            className={`badge badge-${
                              u.role === 'superadmin' ? 'navy' : 
                              u.role === 'admin' ? 'navy' : 
                              u.role === 'rider' ? 'warning' : 'success'
                            }`}
                            style={{ textTransform: 'capitalize' }}
                          >
                            {u.role === 'user' ? 'Customer' : u.role}
                          </span>
                        </td>
                        <td>
                          {/* Approval toggles for admins & riders */}
                          {['admin', 'rider'].includes(u.role) ? (
                            <button
                              onClick={() => handleApproveToggle(u._id, u.isApproved)}
                              className={`badge badge-${u.isApproved ? 'success' : 'danger'}`}
                              style={{ border: 'none', cursor: 'pointer', padding: '4px 10px' }}
                            >
                              {u.isApproved ? 'Approved' : 'Pending'}
                            </button>
                          ) : (
                            <span className="text-muted" style={{ fontSize: '0.85rem' }}>Auto-Approved</span>
                          )}
                        </td>
                        <td>
                          <span className={`badge badge-${u.isBlocked ? 'danger' : 'success'}`}>
                            {u.isBlocked ? 'Blocked' : 'Active'}
                          </span>
                        </td>
                        <td>
                          <span className="text-muted" style={{ fontSize: '0.8rem' }}>
                            {new Date(u.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td>
                          {u.role !== 'superadmin' ? (
                            <button
                              onClick={() => handleBlockToggle(u._id, u.isBlocked)}
                              className={`btn ${u.isBlocked ? 'btn-gold' : 'btn-outline'} btn-sm`}
                              style={{ gap: 6, width: 110, justifyContent: 'center' }}
                            >
                              {u.isBlocked ? (
                                <>
                                  <Unlock size={12} /> Unblock
                                </>
                              ) : (
                                <>
                                  <Ban size={12} /> Block Account
                                </>
                              )}
                            </button>
                          ) : (
                            <span className="text-muted" style={{ fontSize: '0.8rem', fontStyle: 'italic' }}>Protected Account</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminUsers;
