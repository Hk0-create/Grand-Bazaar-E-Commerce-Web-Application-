import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, Truck, Shield, ArrowLeft } from 'lucide-react';
import { addToCart } from '../../store/slices/cartSlice.js';
import { toggleCart } from '../../store/slices/uiSlice.js';
import api from '../../utils/api.js';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    api.get(`/products/${id}`).then((r) => { setProduct(r.data.product); setLoading(false); });
    api.get(`/reviews/product/${id}`).then((r) => setReviews(r.data.reviews || []));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) { toast.error('Please login to add to cart'); navigate('/login'); return; }
    await dispatch(addToCart({ productId: id, quantity: qty, color: selectedColor, size: selectedSize }));
    dispatch(toggleCart());
  };

  if (loading) return <div className="flex flex-center" style={{ minHeight: '100vh' }}><div className="spinner" /></div>;
  if (!product) return <div className="flex flex-center" style={{ minHeight: '100vh' }}><h2>Product not found</h2></div>;

  return (
    <div style={{ paddingTop: 90, minHeight: '100vh' }}>
      <div className="container section">
        <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm mb-6">
          <ArrowLeft size={16} /> Back
        </button>
        <div className="grid-2 grid" style={{ alignItems: 'start' }}>
          {/* Images */}
          <div>
            <div className="card" style={{ aspectRatio: '1', overflow: 'hidden', marginBottom: 12 }}>
              <img src={product.images?.[activeImg] || '/placeholder.png'} alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            {product.images?.length > 1 && (
              <div style={{ display: 'flex', gap: 8 }}>
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    style={{ width: 72, height: 72, borderRadius: 8, overflow: 'hidden',
                      border: `2px solid ${i === activeImg ? 'var(--gold)' : 'var(--gray-200)'}` }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="card card-body">
            <p style={{ color: 'var(--gold-dark)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>
              {product.category?.name}
            </p>
            <h1 style={{ fontSize: '1.6rem', color: 'var(--navy)', marginBottom: 12 }}>{product.name}</h1>
            <div className="stars mb-4">
              {[1,2,3,4,5].map((s) => <span key={s} className={`star ${s <= Math.round(product.rating) ? 'filled' : ''}`}>★</span>)}
              <span className="text-muted" style={{ fontSize: '0.85rem', marginLeft: 8 }}>({product.numReviews} reviews)</span>
            </div>
            <div className="flex gap-2 items-center mb-6">
              {product.discount > 0 && <span className="price-original">Rs. {product.sellingPrice?.toLocaleString()}</span>}
              <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--navy)' }}>
                Rs. {product.finalPrice?.toLocaleString() || product.sellingPrice?.toLocaleString()}
              </span>
              {product.discount > 0 && <span className="badge badge-gold">-{product.discount}%</span>}
            </div>

            <p style={{ color: 'var(--gray-600)', lineHeight: 1.7, marginBottom: 20 }}>{product.description}</p>

            {product.colors?.length > 0 && (
              <div className="mb-4">
                <p className="form-label mb-2">Color</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  {product.colors.map((c) => (
                    <button key={c} onClick={() => setSelectedColor(c)}
                      style={{ padding: '6px 14px', borderRadius: 999, border: `2px solid ${selectedColor === c ? 'var(--navy)' : 'var(--gray-200)'}`,
                        background: selectedColor === c ? 'var(--navy)' : 'white', color: selectedColor === c ? 'white' : 'var(--gray-700)', fontSize: '0.85rem', cursor: 'pointer' }}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.sizes?.length > 0 && (
              <div className="mb-4">
                <p className="form-label mb-2">Size</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  {product.sizes.map((s) => (
                    <button key={s} onClick={() => setSelectedSize(s)}
                      style={{ width: 44, height: 44, borderRadius: 8, border: `2px solid ${selectedSize === s ? 'var(--navy)' : 'var(--gray-200)'}`,
                        background: selectedSize === s ? 'var(--navy)' : 'white', color: selectedSize === s ? 'white' : 'var(--gray-700)', fontWeight: 600, cursor: 'pointer' }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4 items-center mb-6">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--gray-100)', borderRadius: 999, padding: '8px 16px' }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ fontWeight: 700, cursor: 'pointer', background: 'none', border: 'none', fontSize: '1.2rem' }}>-</button>
                <span style={{ minWidth: 24, textAlign: 'center', fontWeight: 600 }}>{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} style={{ fontWeight: 700, cursor: 'pointer', background: 'none', border: 'none', fontSize: '1.2rem' }}>+</button>
              </div>
              <span className="text-muted" style={{ fontSize: '0.85rem' }}>{product.stock} in stock</span>
            </div>

            <motion.button className="btn btn-gold" style={{ width: '100%', justifyContent: 'center', marginBottom: 8 }}
              onClick={handleAddToCart} whileTap={{ scale: 0.97 }}>
              <ShoppingCart size={20} /> Add to Cart
            </motion.button>

            <div className="flex gap-4 mt-4" style={{ borderTop: '1px solid var(--gray-200)', paddingTop: 16 }}>
              <div className="flex gap-2 items-center text-muted" style={{ fontSize: '0.85rem' }}>
                <Truck size={16} /> Free delivery on Rs. 1000+
              </div>
              <div className="flex gap-2 items-center text-muted" style={{ fontSize: '0.85rem' }}>
                <Shield size={16} /> Secure checkout
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        {reviews.length > 0 && (
          <div className="mt-8">
            <h3 style={{ color: 'var(--navy)', marginBottom: 24 }}>Customer Reviews ({reviews.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {reviews.map((r) => (
                <div key={r._id} className="card card-body">
                  <div className="flex gap-4 items-center mb-2">
                    <div className="nav-avatar-placeholder">{r.user?.name?.charAt(0)}</div>
                    <div>
                      <p style={{ fontWeight: 600, color: 'var(--navy)' }}>{r.user?.name}</p>
                      <div className="stars">{[1,2,3,4,5].map((s) => <span key={s} className={`star ${s <= r.rating ? 'filled' : ''}`}>★</span>)}</div>
                    </div>
                  </div>
                  <p style={{ color: 'var(--gray-600)' }}>{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
