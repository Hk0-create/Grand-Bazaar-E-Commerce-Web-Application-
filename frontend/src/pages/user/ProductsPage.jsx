import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import api from '../../utils/api.js';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice.js';
import { ProductCard } from './HomePage.jsx';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 12 });
    if (keyword) params.set('keyword', keyword);
    if (category) params.set('category', category);
    api.get(`/products?${params}`).then((r) => {
      setProducts(r.data.products || []);
      setTotal(r.data.total || 0);
      setLoading(false);
    });
    api.get('/categories').then((r) => setCategories(r.data.categories || []));
  }, [keyword, category, page]);

  return (
    <div className="products-page" style={{ paddingTop: 90, minHeight: '100vh' }}>
      <div className="container section">
        <div className="flex flex-between mb-6 flex-wrap gap-4">
          <div>
            <h1 style={{ fontSize: '2rem', color: 'var(--navy)' }}>
              {keyword ? `Results for "${keyword}"` : 'All Products'}
            </h1>
            <p className="text-muted">{total} products found</p>
          </div>
        </div>

        <div className="flex gap-4">
          {/* Sidebar filters */}
          <aside className="products-sidebar hide-mobile">
            <div className="card card-body">
              <h4 style={{ marginBottom: 16 }}>Categories</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <li>
                  <button
                    className={`filter-btn ${!category ? 'active' : ''}`}
                    onClick={() => setSearchParams({})}
                  >All Categories</button>
                </li>
                {categories.map((cat) => (
                  <li key={cat._id}>
                    <button
                      className={`filter-btn ${category === cat._id ? 'active' : ''}`}
                      onClick={() => setSearchParams({ category: cat._id })}
                    >{cat.name}</button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Products */}
          <div style={{ flex: 1 }}>
            {loading ? (
              <div className="flex flex-center" style={{ minHeight: 300 }}><div className="spinner" /></div>
            ) : products.length === 0 ? (
              <div className="card card-body" style={{ textAlign: 'center', padding: '60px 20px' }}>
                <h3>No products found</h3>
                <p className="text-muted mt-2">Try a different search or category</p>
              </div>
            ) : (
              <div className="grid-auto grid">{products.map((p) => <ProductCard key={p._id} product={p} />)}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
