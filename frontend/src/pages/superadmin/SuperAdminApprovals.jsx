import { useEffect, useState } from 'react';
import api from '../../utils/api.js';
import { CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import logo from '../../assets/logo.png';

const SuperAdminApprovals = () => {
  const [pendingProducts, setPendingProducts] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);

  useEffect(() => {
    api.get('/superadmin/products/pending').then((r) => setPendingProducts(r.data.products || []));
    api.get('/superadmin/users').then((r) => {
      const pending = r.data.users?.filter((u) => u.role === 'admin' && !u.isApproved);
      setPendingUsers(pending || []);
    });
  }, []);

  const approveProduct = async (id, approved) => {
    await api.patch(`/superadmin/products/${id}/approve`, { approved });
    setPendingProducts((prev) => prev.filter((p) => p._id !== id));
    toast.success(approved ? 'Product approved!' : 'Product rejected');
  };

  const approveUser = async (id, approved) => {
    await api.patch(`/superadmin/users/${id}/approve`, { approved });
    setPendingUsers((prev) => prev.filter((u) => u._id !== id));
    toast.success(approved ? 'User approved!' : 'User rejected');
  };

  return (
    <div style={{ padding: 40, minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <img src={logo} alt="" style={{ height: 40 }} />
        <h2 style={{ color: 'var(--navy)' }}>Pending Approvals</h2>
      </div>

      <h4 style={{ color: 'var(--navy)', marginBottom: 16 }}>Product Approvals ({pendingProducts.length})</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}>
        {pendingProducts.length === 0 ? <p className="text-muted">No pending products</p> : pendingProducts.map((p) => (
          <div key={p._id} className="card card-body flex flex-between gap-4">
            <div className="flex gap-4 items-center">
              <img src={p.images?.[0] || '/logo.png'} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }} />
              <div><h4 style={{ color: 'var(--navy)' }}>{p.name}</h4><p className="text-muted">{p.category?.name} · {p.createdBy?.name}</p></div>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-gold btn-sm" onClick={() => approveProduct(p._id, true)}><CheckCircle size={16} /> Approve</button>
              <button className="btn btn-danger btn-sm" onClick={() => approveProduct(p._id, false)}><XCircle size={16} /> Reject</button>
            </div>
          </div>
        ))}
      </div>

      <h4 style={{ color: 'var(--navy)', marginBottom: 16 }}>Admin/Rider Approvals ({pendingUsers.length})</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {pendingUsers.length === 0 ? <p className="text-muted">No pending users</p> : pendingUsers.map((u) => (
          <div key={u._id} className="card card-body flex flex-between gap-4">
            <div><h4 style={{ color: 'var(--navy)' }}>{u.name}</h4><p className="text-muted">{u.email} · {u.role}</p></div>
            <div className="flex gap-2">
              <button className="btn btn-gold btn-sm" onClick={() => approveUser(u._id, true)}><CheckCircle size={16} /> Approve</button>
              <button className="btn btn-danger btn-sm" onClick={() => approveUser(u._id, false)}><XCircle size={16} /> Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuperAdminApprovals;
