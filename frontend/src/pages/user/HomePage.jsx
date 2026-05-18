import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Shield, Truck, Star, Zap } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import api from '../../utils/api.js';
import logo from '../../assets/logo.png';
import './HomePage.css';

const HERO_SLIDES = [
  {
    title: 'Discover Premium Products',
    subtitle: 'Shop from thousands of curated items at unbeatable prices',
    bg: 'linear-gradient(135deg, #0D1B3E 0%, #1a2f5e 60%, #0a1628 100%)',
    accent: '#C9A84C',
  },
  {
    title: 'Fast & Secure Delivery',
    subtitle: 'Real-time order tracking with dedicated riders',
    bg: 'linear-gradient(135deg, #080f24 0%, #0D1B3E 60%, #1a2f5e 100%)',
    accent: '#e2c06a',
  },
  {
    title: 'Premium Quality Guaranteed',
    subtitle: 'All products vetted and approved by our expert team',
    bg: 'linear-gradient(135deg, #0a1628 0%, #16294d 60%, #0D1B3E 100%)',
    accent: '#C9A84C',
  },
];

const FEATURES = [
  { icon: Truck, title: 'Fast Delivery', desc: 'Same-day delivery in major cities across Pakistan' },
  { icon: Shield, title: 'Secure Payments', desc: 'Stripe & Cash on Delivery options available' },
  { icon: Star, title: 'Quality Assured', desc: 'All products reviewed and approved by our team' },
  { icon: Zap, title: 'Real-time Tracking', desc: 'Track your order live with direct rider communication' },
];

const fadeUp = { hidden: { opacity: 0, y: 30 }, show: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.5 } }) };

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get('/products/featured').then((r) => setFeaturedProducts(r.data.products || []));
    api.get('/categories').then((r) => setCategories(r.data.categories?.slice(0, 6) || []));
  }, []);

  return (
    <div className="home-page">
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="hero-section">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop
          className="hero-swiper"
        >
          {HERO_SLIDES.map((slide, i) => (
            <SwiperSlide key={i}>
              <div className="hero-slide" style={{ background: slide.bg }}>
                {/* Decorative elements */}
                <div className="hero-decor-circle hero-decor-1" />
                <div className="hero-decor-circle hero-decor-2" />
                <div className="hero-decor-circle hero-decor-3" />

                <div className="container hero-content">
                  <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    className="hero-text"
                  >
                    <motion.span
                      className="hero-badge"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      ✦ Pakistan's #1 Marketplace
                    </motion.span>
                    <h1 className="hero-title">{slide.title}</h1>
                    <p className="hero-subtitle">{slide.subtitle}</p>
                    <div className="hero-actions">
                      <Link to="/products" className="btn btn-gold btn-lg">
                        Shop Now <ArrowRight size={20} />
                      </Link>
                      <Link to="/categories" className="btn btn-outline-gold btn-lg">
                        Browse Categories
                      </Link>
                    </div>
                    <div className="hero-stats">
                      {[['10K+', 'Products'], ['50K+', 'Customers'], ['99%', 'Satisfaction']].map(([num, label]) => (
                        <div key={label} className="hero-stat">
                          <span className="hero-stat-num">{num}</span>
                          <span className="hero-stat-label">{label}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div
                    className="hero-logo-wrap"
                    initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
                  >
                    <div className="hero-logo-glow" />
                    <motion.img
                      src={logo}
                      alt="Grand Bazaar"
                      className="hero-logo"
                      animate={{ y: [0, -12, 0] }}
                      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* ── Features ──────────────────────────────────────── */}
      <section className="features-section section-sm">
        <div className="container">
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                className="feature-card glass-card"
                custom={i}
                initial="hidden"
                whileInView="show"
                variants={fadeUp}
                viewport={{ once: true }}
                whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(13,27,62,0.15)' }}
              >
                <div className="feature-icon">
                  <f.icon size={28} />
                </div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ────────────────────────────────────── */}
      {categories.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-title">
              <h2>Shop by Category</h2>
              <p>Find exactly what you're looking for</p>
              <span className="accent" />
            </div>
            <div className="categories-grid">
              {categories.map((cat, i) => (
                <motion.div
                  key={cat._id}
                  custom={i}
                  initial="hidden"
                  whileInView="show"
                  variants={fadeUp}
                  viewport={{ once: true }}
                >
                  <Link to={`/products?category=${cat._id}`} className="category-card">
                    <div className="category-img-wrap">
                      {cat.image ? (
                        <img src={cat.image} alt={cat.name} />
                      ) : (
                        <div className="category-placeholder">
                          <ShoppingBag size={36} />
                        </div>
                      )}
                      <div className="category-overlay" />
                    </div>
                    <div className="category-info">
                      <h4>{cat.name}</h4>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Featured Products ─────────────────────────────── */}
      <section className="section" style={{ background: 'var(--off-white)' }}>
        <div className="container">
          <div className="section-title">
            <h2>Featured Products</h2>
            <p>Handpicked for you — the best deals today</p>
            <span className="accent" />
          </div>

          {featuredProducts.length === 0 ? (
            <div className="empty-featured">
              <motion.div
                className="empty-featured-inner glass-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <img src={logo} alt="Grand Bazaar" style={{ width: 100, margin: '0 auto 16px' }} />
                <h3>Products Coming Soon</h3>
                <p>Our curated collection is being prepared. Check back soon!</p>
                <Link to="/products" className="btn btn-gold btn-sm mt-4">Browse All Products</Link>
              </motion.div>
            </div>
          ) : (
            <>
              <div className="products-grid grid-auto">
                {featuredProducts.map((product, i) => (
                  <motion.div key={product._id} custom={i} initial="hidden" whileInView="show" variants={fadeUp} viewport={{ once: true }}>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
              <div style={{ textAlign: 'center', marginTop: 40 }}>
                <Link to="/products" className="btn btn-outline btn-lg">
                  View All Products <ArrowRight size={20} />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────── */}
      <section className="cta-section">
        <div className="cta-bg" />
        <div className="container">
          <motion.div
            className="cta-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <img src={logo} alt="Grand Bazaar" className="cta-logo" />
            <h2>Ready to Start Shopping?</h2>
            <p>Join 50,000+ happy customers who trust Grand Bazaar</p>
            <div className="flex flex-center gap-4 flex-wrap">
              <Link to="/register" className="btn btn-gold btn-lg">Create Account</Link>
              <Link to="/products" className="btn btn-outline-gold btn-lg">Browse Products</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

// Mini Product Card
const ProductCard = ({ product }) => {
  const dispatch = useDispatch?.();
  const { addToCart: addAction } = useSelector ? (() => ({}))() : {};

  return (
    <Link to={`/products/${product._id}`} className="product-card card">
      <div className="product-card-img-wrap">
        <img
          src={product.images?.[0] || '/placeholder.png'}
          alt={product.name}
          className="product-card-img"
        />
        {product.discount > 0 && (
          <span className="product-discount-badge">-{product.discount}%</span>
        )}
      </div>
      <div className="product-card-body card-body">
        <p className="product-category">{product.category?.name}</p>
        <h4 className="product-name">{product.name}</h4>
        <div className="stars mb-2">
          {[1,2,3,4,5].map((s) => (
            <span key={s} className={`star ${s <= Math.round(product.rating) ? 'filled' : ''}`}>★</span>
          ))}
          <span className="text-muted" style={{ fontSize: '0.78rem', marginLeft: 4 }}>({product.numReviews})</span>
        </div>
        <div className="product-price-row">
          {product.discount > 0 && (
            <span className="price-original">Rs. {product.sellingPrice?.toLocaleString()}</span>
          )}
          <span className="price-final">Rs. {product.finalPrice?.toLocaleString() || product.sellingPrice?.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  );
};

import { useDispatch, useSelector } from 'react-redux';

export { ProductCard };
export default HomePage;
