import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Search, Menu, X, User, Heart, LogOut, Package, ChevronDown, Bell } from 'lucide-react';
import { logoutUser } from '../../store/slices/authSlice.js';
import { toggleCart } from '../../store/slices/uiSlice.js';
import logo from '../../assets/logo.png';
import './Navbar.css';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Products', path: '/products' },
  { label: 'Categories', path: '/categories' },
  { label: 'About', path: '/about' },
];

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((s) => s.auth);
  const { items } = useSelector((s) => s.cart);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const cartCount = items?.length || 0;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'superadmin') return '/superadmin';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'rider') return '/rider';
    return '/account';
  };

  return (
    <>
      <motion.nav
        className={`navbar ${scrolled || location.pathname !== '/' ? 'navbar-scrolled' : ''}`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="container navbar-inner">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <motion.img src={logo} alt="Grand Bazaar" whileHover={{ scale: 1.04 }} transition={{ type: 'spring', stiffness: 300 }} />
          </Link>

          {/* Desktop Nav Links */}
          <ul className="navbar-links hide-mobile">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`navbar-link ${location.pathname === link.path ? 'active' : ''}`}
                >
                  {link.label}
                  {location.pathname === link.path && (
                    <motion.span className="navbar-link-indicator" layoutId="nav-indicator" />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right actions */}
          <div className="navbar-actions">
            {/* Search */}
            <button className="nav-icon-btn" onClick={() => setSearchOpen(true)} aria-label="Search">
              <Search size={20} />
            </button>

            {/* Cart */}
            <button className="nav-icon-btn nav-cart-btn" onClick={() => dispatch(toggleCart())} aria-label="Cart">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <motion.span
                  className="cart-badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500 }}
                >
                  {cartCount > 9 ? '9+' : cartCount}
                </motion.span>
              )}
            </button>

            {/* Wishlist (only for logged users) */}
            {user && user.role === 'user' && (
              <Link to="/account/wishlist" className="nav-icon-btn hide-mobile" aria-label="Wishlist">
                <Heart size={20} />
              </Link>
            )}

            {/* User Menu */}
            {user ? (
              <div className="nav-user-menu" ref={userMenuRef}>
                <button className="nav-user-btn" onClick={() => setUserMenuOpen(!userMenuOpen)}>
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="nav-avatar" />
                  ) : (
                    <div className="nav-avatar-placeholder">{user.name?.charAt(0).toUpperCase()}</div>
                  )}
                  <span className="hide-mobile">{user.name?.split(' ')[0]}</span>
                  <ChevronDown size={16} className={`chevron ${userMenuOpen ? 'open' : ''}`} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      className="user-dropdown"
                      initial={{ opacity: 0, y: -10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.96 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="user-dropdown-header">
                        <p className="user-name">{user.name}</p>
                        <p className="user-email">{user.email}</p>
                        <span className={`badge badge-gold`}>{user.role}</span>
                      </div>
                      <div className="user-dropdown-body">
                        <Link to={getDashboardPath()} className="dropdown-item">
                          <User size={16} /> Dashboard
                        </Link>
                        {user.role === 'user' && (
                          <Link to="/account/orders" className="dropdown-item">
                            <Package size={16} /> My Orders
                          </Link>
                        )}
                        <button onClick={handleLogout} className="dropdown-item dropdown-logout">
                          <LogOut size={16} /> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="nav-auth-btns hide-mobile">
                <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
                <Link to="/register" className="btn btn-gold btn-sm">Sign Up</Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button className="nav-icon-btn hide-desktop" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            className="search-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              className="search-box"
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSearch} className="search-form">
                <Search size={22} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search for products, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="search-input"
                />
                <button type="button" onClick={() => setSearchOpen(false)} className="search-close">
                  <X size={20} />
                </button>
              </form>
              <p className="search-hint">Press Enter to search</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="mobile-menu-header">
              <img src={logo} alt="Grand Bazaar" className="mobile-menu-logo" />
              <button onClick={() => setMobileOpen(false)}><X size={24} /></button>
            </div>
            <ul className="mobile-menu-links">
              {navLinks.map((link, i) => (
                <motion.li key={link.path} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                  <Link to={link.path} className={`mobile-link ${location.pathname === link.path ? 'active' : ''}`}>
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            {!user && (
              <div className="mobile-auth">
                <Link to="/login" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>Login</Link>
                <Link to="/register" className="btn btn-gold" style={{ width: '100%', justifyContent: 'center' }}>Sign Up</Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
