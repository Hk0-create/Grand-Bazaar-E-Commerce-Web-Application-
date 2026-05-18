import { AdminSidebar } from './AdminDashboard.jsx';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../utils/api.js';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AdminAddProduct = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { api.get('/categories').then((r) => setCategories(r.data.categories || [])); }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = { ...data, colors: data.colors?.split(',').map((c) => c.trim()).filter(Boolean),
        sizes: data.sizes?.split(',').map((s) => s.trim()).filter(Boolean),
        images: data.imageUrl ? [data.imageUrl] : [] };
      await api.post('/products', payload);
      toast.success('Product submitted for approval!');
      navigate('/admin/products');
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
    setLoading(false);
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <h2 style={{ color: 'var(--navy)', marginBottom: 24 }}>Add New Product</h2>
        <div className="card card-body" style={{ maxWidth: 720 }}>
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Product Name *</label>
              <input className="form-input" {...register('name', { required: true })} placeholder="Product name" />
            </div>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select className="form-input" {...register('category', { required: true })}>
                <option value="">Select category</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea className="form-input" rows={4} {...register('description', { required: true })} placeholder="Product description" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Cost Price (Rs.) *</label>
                <input type="number" className="form-input" {...register('costPrice', { required: true })} />
              </div>
              <div className="form-group">
                <label className="form-label">Selling Price (Rs.) *</label>
                <input type="number" className="form-input" {...register('sellingPrice', { required: true })} />
              </div>
              <div className="form-group">
                <label className="form-label">Stock Quantity *</label>
                <input type="number" className="form-input" {...register('stock', { required: true })} />
              </div>
              <div className="form-group">
                <label className="form-label">Delivery Charges (Rs.)</label>
                <input type="number" className="form-input" {...register('deliveryCharges')} defaultValue={0} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Colors (comma separated)</label>
              <input className="form-input" {...register('colors')} placeholder="Red, Blue, Green" />
            </div>
            <div className="form-group">
              <label className="form-label">Sizes (comma separated)</label>
              <input className="form-input" {...register('sizes')} placeholder="S, M, L, XL" />
            </div>
            <div className="form-group">
              <label className="form-label">Product Image URL</label>
              <input className="form-input" {...register('imageUrl')} placeholder="https://..." />
            </div>
            <button type="submit" className="btn btn-gold" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit for Approval'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminAddProduct;
