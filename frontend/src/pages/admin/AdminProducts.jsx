import { AdminSidebar } from './AdminDashboard.jsx';
import { useEffect, useState } from 'react';
import api from '../../utils/api.js';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products?limit=50').then((r) => { setProducts(r.data.products || []); setLoading(false); });
  }, []);

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <div className="flex flex-between mb-6">
          <h2 style={{ color: 'var(--navy)' }}>Products</h2>
          <Link to="/admin/products/add" className="btn btn-gold"><Plus size={18} /> Add Product</Link>
        </div>
        <div className="card">
          <div className="card-body orders-table-wrap">
            <table className="orders-table">
              <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id}>
                    <td><img src={p.images?.[0] || '/logo.png'} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8 }} /></td>
                    <td style={{ fontWeight: 600 }}>{p.name}</td>
                    <td>{p.category?.name}</td>
                    <td>Rs. {p.finalPrice?.toLocaleString()}</td>
                    <td>{p.stock}</td>
                    <td><span className={`badge ${p.isApproved ? 'badge-success' : 'badge-warning'}`}>{p.isApproved ? 'Active' : 'Pending'}</span></td>
                    <td style={{ display: 'flex', gap: 8 }}>
                      <Link to={`/products/${p._id}`} className="btn btn-ghost btn-sm"><Eye size={16} /></Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
