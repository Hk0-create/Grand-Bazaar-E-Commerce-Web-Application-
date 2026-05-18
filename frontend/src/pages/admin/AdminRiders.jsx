import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, CheckCircle, XCircle, UserCheck, ShieldAlert, Sparkles } from 'lucide-react';
import api from '../../utils/api.js';
import toast from 'react-hot-toast';
import { AdminSidebar } from './AdminDashboard.jsx';

const AdminRiders = () => {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRiders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/riders');
      setRiders(data.riders || []);
    } catch (err) {
      toast.error('Failed to load riders list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiders();
  }, []);

  const handleApprove = async (id, approved) => {
    try {
      const { data } = await api.patch(`/admin/riders/${id}/approve`, { approved });
      toast.success(data.message || 'Rider updated!');
      fetchRiders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  const pendingRiders = riders.filter((r) => !r.isApproved);
  const approvedRiders = riders.filter((r) => r.isApproved);

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <div className="admin-header">
          <div>
            <h2>Rider Management</h2>
            <p className="text-muted">Approve new registration requests and oversee delivery partners.</p>
          </div>
          <div className="stat-badge" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Users size={16} />
            <span>Total Riders: {riders.length}</span>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>
            <div className="spinner-gold" />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }} className="mt-6">
            
            {/* Pending Requests */}
            <motion.div className="card" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
              <div className="card-body">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <ShieldAlert size={20} color="var(--gold)" />
                  <h4 style={{ margin: 0 }}>Pending Approval Requests ({pendingRiders.length})</h4>
                </div>

                {pendingRiders.length === 0 ? (
                  <p className="text-muted" style={{ padding: '20px 0' }}>No pending rider registration requests.</p>
                ) : (
                  <div className="orders-table-wrap">
                    <table className="orders-table">
                      <thead>
                        <tr>
                          <th>Rider Name</th>
                          <th>Email Address</th>
                          <th>Phone</th>
                          <th>Registered Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingRiders.map((r) => (
                          <tr key={r._id}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div className="nav-avatar-placeholder">{r.name.charAt(0)}</div>
                                <strong>{r.name}</strong>
                              </div>
                            </td>
                            <td>{r.email}</td>
                            <td>{r.phone || 'N/A'}</td>
                            <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                            <td>
                              <div className="flex gap-2">
                                <button className="btn btn-gold btn-sm" onClick={() => handleApprove(r._id, true)}>
                                  <CheckCircle size={14} /> Approve
                                </button>
                                <button className="btn btn-danger btn-sm" style={{ padding: '6px 12px' }} onClick={() => handleApprove(r._id, false)}>
                                  <XCircle size={14} /> Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Approved Riders */}
            <motion.div className="card" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="card-body">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <UserCheck size={20} color="#16a34a" />
                  <h4 style={{ margin: 0 }}>Approved Riders ({approvedRiders.length})</h4>
                </div>

                {approvedRiders.length === 0 ? (
                  <p className="text-muted" style={{ padding: '20px 0' }}>No approved riders yet.</p>
                ) : (
                  <div className="orders-table-wrap">
                    <table className="orders-table">
                      <thead>
                        <tr>
                          <th>Rider Name</th>
                          <th>Email Address</th>
                          <th>Phone</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {approvedRiders.map((r) => (
                          <tr key={r._id}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div className="nav-avatar-placeholder" style={{ background: '#16a34a' }}>{r.name.charAt(0)}</div>
                                <strong>{r.name}</strong>
                              </div>
                            </td>
                            <td>{r.email}</td>
                            <td>{r.phone || 'N/A'}</td>
                            <td>
                              <span className={`badge badge-${r.isBlocked ? 'danger' : 'success'}`}>
                                {r.isBlocked ? 'Blocked' : 'Active'}
                              </span>
                            </td>
                            <td>
                              <button className="btn btn-ghost btn-sm" onClick={() => handleApprove(r._id, false)} style={{ color: 'var(--red)' }}>
                                Revoke Approval
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>

          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRiders;
