import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ShoppingBag, FolderOpen, ArrowRight, Layers } from 'lucide-react';
import api from '../../utils/api.js';

const CategoriesPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setLoading(true);
    api.get('/categories')
      .then((r) => {
        setCategories(r.data.categories || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching categories:', err);
        setLoading(false);
      });
  }, []);

  // Filter based on search input
  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Gradient backgrounds for categories that lack custom images
  const gradientAccents = [
    'linear-gradient(135deg, #0D1B3E 0%, #1a2f5e 100%)',
    'linear-gradient(135deg, #C9A84C 0%, #a8862e 100%)',
    'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
    'linear-gradient(135deg, #14532d 0%, #22c55e 100%)',
    'linear-gradient(135deg, #7c2d12 0%, #ea580c 100%)',
    'linear-gradient(135deg, #581c87 0%, #a855f7 100%)',
  ];

  return (
    <div style={{ paddingTop: 100, paddingBottom: 80, minHeight: '100vh', background: 'var(--off-white)' }}>
      {/* Page Header */}
      <div style={{
        background: 'linear-gradient(180deg, #0D1B3E 0%, #11224d 100%)',
        color: 'white',
        padding: '50px 20px 40px',
        textAlign: 'center',
        borderBottom: '3px solid var(--gold)',
        marginBottom: 50
      }}>
        <div className="container" style={{ maxWidth: 700 }}>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(201, 168, 76, 0.12)', border: '1px solid rgba(201,168,76,0.3)', padding: '8px 20px', borderRadius: 999, marginBottom: 16 }}
          >
            <Layers size={18} color="var(--gold)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em', color: 'var(--gold)' }}>BROWSE SECTIONS</span>
          </motion.div>
          
          <h2 style={{ fontFamily: 'Playfair Display, serif', color: 'white', fontSize: '2.5rem', marginBottom: 12 }}>
            Explore Categories
          </h2>
          <p className="text-muted" style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1rem' }}>
            Find the finest items cataloged by boutique categories.
          </p>

          {/* Search bar inside header */}
          <div style={{
            position: 'relative',
            maxWidth: 480,
            margin: '24px auto 0',
            boxShadow: 'var(--shadow-lg)',
            borderRadius: 999
          }}>
            <Search size={18} style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', color: 'var(--gold)' }} />
            <input
              type="text"
              placeholder="Search category keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 20px 14px 50px',
                borderRadius: 999,
                border: '1px solid rgba(251,191,36,0.3)',
                background: 'rgba(255, 255, 255, 0.95)',
                outline: 'none',
                color: 'var(--navy)',
                fontSize: '0.95rem'
              }}
            />
          </div>
        </div>
      </div>

      <div className="container">
        {loading ? (
          <div className="flex flex-center" style={{ minHeight: 250 }}>
            <div className="spinner spinner-gold" />
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="card" style={{ padding: '60px 20px', textAlign: 'center', border: '1px solid var(--gray-200)' }}>
            <FolderOpen size={48} style={{ color: 'var(--gray-400)', marginBottom: 16 }} />
            <h3 style={{ color: 'var(--navy)' }}>No Categories Found</h3>
            <p className="text-muted mt-2">We couldn't find any category matching "{searchTerm}".</p>
          </div>
        ) : (
          <div className="grid grid-3">
            {filteredCategories.map((cat, i) => {
              const bgGradient = gradientAccents[i % gradientAccents.length];
              return (
                <motion.div
                  key={cat._id}
                  className="card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    border: '1px solid var(--gray-200)',
                    overflow: 'hidden',
                    background: 'white'
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  whileHover={{ y: -6, boxShadow: 'var(--shadow-lg)' }}
                >
                  {/* Category Image or Custom Decorative Accent */}
                  <div style={{ position: 'relative', height: 160, overflow: 'hidden' }}>
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        background: bgGradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <ShoppingBag size={48} color="white" style={{ opacity: 0.6 }} />
                      </div>
                    )}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, transparent 40%, rgba(13,27,62,0.85) 100%)'
                    }} />
                    <h3 style={{
                      position: 'absolute',
                      bottom: 16,
                      left: 20,
                      color: 'white',
                      fontSize: '1.4rem',
                      fontWeight: 700,
                      textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                    }}>
                      {cat.name}
                    </h3>
                  </div>

                  {/* Body Content */}
                  <div style={{ padding: 24, display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                    <p className="text-muted" style={{
                      fontSize: '0.9rem',
                      lineHeight: 1.6,
                      marginBottom: 24,
                      minHeight: 44,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {cat.description || 'Discover our curated boutique collection in this exclusive product category.'}
                    </p>

                    <button
                      onClick={() => navigate(`/products?category=${cat._id}`)}
                      className="btn btn-gold btn-sm"
                      style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                    >
                      Explore Collection
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
