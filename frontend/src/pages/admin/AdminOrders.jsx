import { AdminSidebar } from './AdminDashboard.jsx';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, Check, X, ShieldAlert } from 'lucide-react';
import api from '../../utils/api.js';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRiderModal, setShowRiderModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [availableRiders, setAvailableRiders] = useState([]);
  const [loadingRiders, setLoadingRiders] = useState(false);

  useEffect(() => {
    api.get('/orders?limit=50').then((r) => { setOrders(r.data.orders || []); setLoading(false); });
  }, []);

  useEffect(() => {
    if (showRiderModal) {
      setLoadingRiders(true);
      api.get('/admin/riders/available')
        .then((r) => {
          setAvailableRiders(r.data.riders || []);
          setLoadingRiders(false);
        })
        .catch(() => {
          toast.error('Failed to load available riders');
          setLoadingRiders(false);
        });
    }
  }, [showRiderModal]);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/orders/${id}/status`, { status });
      setOrders((prev) => prev.map((o) => o._id === id ? { ...o, status } : o));
      toast.success(`Order status updated to ${status}`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    if (newStatus === 'assigned') {
      setSelectedOrderId(orderId);
      setShowRiderModal(true);
    } else {
      updateStatus(orderId, newStatus);
    }
  };

  const handleAssignRider = async (riderId) => {
    try {
      const { data } = await api.patch(`/orders/${selectedOrderId}/assign-rider`, { riderId });
      setOrders((prev) => prev.map((o) => o._id === selectedOrderId ? { ...o, status: 'assigned', rider: data.order.rider } : o));
      toast.success('Rider assigned successfully!');
      setShowRiderModal(false);
      setSelectedOrderId(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to assign rider');
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <h2 style={{ color: 'var(--navy)', marginBottom: 24 }}>Orders Management</h2>
        
        <div className="card">
          <div className="card-body orders-table-wrap">
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 0' }}>
                <div className="spinner-gold" />
              </div>
            ) : orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--gray-400)' }}>
                <p>No orders found</p>
              </div>
            ) : (
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Assigned Rider</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o._id}>
                      <td><span className="order-num">{o.orderNumber}</span></td>
                      <td>{o.user?.name}</td>
                      <td>Rs. {o.totalPrice?.toLocaleString()}</td>
                      <td>
                        <span className={`badge badge-${o.paymentStatus === 'paid' ? 'success' : 'warning'}`}>
                          {o.paymentStatus}
                        </span>
                      </td>
                      <td>
                        {o.rider ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div className="nav-avatar-placeholder" style={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                              {o.rider.name?.charAt(0)}
                            </div>
                            <span style={{ fontSize: '0.85rem' }}>{o.rider.name}</span>
                          </div>
                        ) : (
                          <span className="text-muted" style={{ fontSize: '0.8rem' }}>Unassigned</span>
                        )}
                      </td>
                      <td>
                        <select 
                          value={o.status} 
                          onChange={(e) => handleStatusChange(o._id, e.target.value)}
                          style={{ padding: '4px 8px', borderRadius: 8, border: '1px solid var(--gray-200)', fontSize: '0.85rem', cursor: 'pointer' }}
                        >
                          {['pending','confirmed','processing','assigned','out_for_delivery','delivered','cancelled'].map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <span className="text-muted" style={{ fontSize: '0.8rem' }}>
                          {new Date(o.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Rider Assignment Modal */}
      <AnimatePresence>
        {showRiderModal && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(13, 27, 62, 0.4)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
          }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                backgroundColor: 'white', borderRadius: 20, width: '90%', maxWidth: 500,
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
                overflow: 'hidden'
              }}
            >
              {/* Header */}
              <div style={{
                padding: '20px 24px', borderBottom: '1px solid var(--gray-100)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: 'var(--navy)', color: 'white'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <User size={20} color="var(--gold)" />
                  <h3 style={{ margin: 0, color: 'white', fontSize: '1.25rem' }}>Select Available Rider</h3>
                </div>
                <button 
                  onClick={() => { setShowRiderModal(false); setSelectedOrderId(null); }}
                  style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex' }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div style={{ padding: 24, maxHeight: 400, overflowY: 'auto' }}>
                {loadingRiders ? (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
                    <div className="spinner-gold" />
                  </div>
                ) : availableRiders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '24px 0' }}>
                    <ShieldAlert size={48} color="var(--gold)" style={{ margin: '0 auto 12px' }} />
                    <p style={{ margin: 0, fontWeight: 500 }}>No Available Riders</p>
                    <p className="text-muted" style={{ fontSize: '0.875rem', marginTop: 4 }}>
                      There are no active, approved riders. Approve riders in the Riders tab first.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {availableRiders.map((r) => (
                      <div 
                        key={r._id}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: 16, borderRadius: 12, border: '1px solid var(--gray-100)',
                          background: 'var(--gray-50)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div className="nav-avatar-placeholder" style={{ margin: 0 }}>
                            {r.name.charAt(0)}
                          </div>
                          <div>
                            <strong style={{ display: 'block', color: 'var(--navy)' }}>{r.name}</strong>
                            <span className="text-muted" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                              <Phone size={12} /> {r.phone || 'No phone'}
                            </span>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => handleAssignRider(r._id)}
                          className="btn btn-gold btn-sm"
                          style={{ gap: 6 }}
                        >
                          <Check size={14} /> Assign
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminOrders;
