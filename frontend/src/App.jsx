import { useEffect, useState, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMe } from './store/slices/authSlice.js';
import { fetchCart } from './store/slices/cartSlice.js';
import './styles/products.css';
import Loader from './components/common/Loader.jsx';
import Navbar from './components/common/Navbar.jsx';
import Footer from './components/common/Footer.jsx';
import CartDrawer from './components/common/CartDrawer.jsx';

// Lazy loaded pages
const HomePage = lazy(() => import('./pages/user/HomePage.jsx'));
const ProductsPage = lazy(() => import('./pages/user/ProductsPage.jsx'));
const ProductDetailPage = lazy(() => import('./pages/user/ProductDetailPage.jsx'));
const CartPage = lazy(() => import('./pages/user/CartPage.jsx'));
const CheckoutPage = lazy(() => import('./pages/user/CheckoutPage.jsx'));
const OrderSuccessPage = lazy(() => import('./pages/user/OrderSuccessPage.jsx'));
const OrderTrackingPage = lazy(() => import('./pages/user/OrderTrackingPage.jsx'));
const AccountPage = lazy(() => import('./pages/user/AccountPage.jsx'));
const OrdersPage = lazy(() => import('./pages/user/OrdersPage.jsx'));
const WishlistPage = lazy(() => import('./pages/user/WishlistPage.jsx'));
const CategoriesPage = lazy(() => import('./pages/user/CategoriesPage.jsx'));
const AboutPage = lazy(() => import('./pages/user/AboutPage.jsx'));

// Auth pages
const LoginPage = lazy(() => import('./pages/auth/LoginPage.jsx'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage.jsx'));
const AdminLoginPage = lazy(() => import('./pages/auth/AdminLoginPage.jsx'));
const AdminRegisterPage = lazy(() => import('./pages/auth/AdminRegisterPage.jsx'));
const RiderLoginPage = lazy(() => import('./pages/auth/RiderLoginPage.jsx'));
const GoogleAuthSuccess = lazy(() => import('./pages/auth/GoogleAuthSuccess.jsx'));

// Admin pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.jsx'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts.jsx'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders.jsx'));
const AdminAddProduct = lazy(() => import('./pages/admin/AdminAddProduct.jsx'));
const AdminRiders = lazy(() => import('./pages/admin/AdminRiders.jsx'));

// Rider pages
const RiderDashboard = lazy(() => import('./pages/rider/RiderDashboard.jsx'));
const RiderOrders = lazy(() => import('./pages/rider/RiderOrders.jsx'));

// Super Admin pages
const SuperAdminDashboard = lazy(() => import('./pages/superadmin/SuperAdminDashboard.jsx'));
const SuperAdminUsers = lazy(() => import('./pages/superadmin/SuperAdminUsers.jsx'));
const SuperAdminApprovals = lazy(() => import('./pages/superadmin/SuperAdminApprovals.jsx'));

// Protected Route wrappers
const ProtectedRoute = ({ children, roles }) => {
  const { user, token, initialized } = useSelector((s) => s.auth);
  if (!initialized) return null;
  if (!token || !user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  if (user.isBlocked) return <Navigate to="/blocked" replace />;
  return children;
};

// Pages with no navbar (admin/rider portals)
const PORTAL_PATHS = ['/admin', '/rider', '/superadmin'];

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { token, initialized } = useSelector((s) => s.auth);
  const [appLoading, setAppLoading] = useState(true);

  const isPortal = PORTAL_PATHS.some((p) => location.pathname.startsWith(p));

  useEffect(() => {
    const init = async () => {
      if (token) {
        await dispatch(fetchMe());
        await dispatch(fetchCart());
      } else {
        // Still mark as initialized
        dispatch({ type: 'auth/fetchMe/rejected' });
      }
      setTimeout(() => setAppLoading(false), 1000);
    };
    init();
  }, []);

  if (appLoading || !initialized) return <Loader isVisible={appLoading} />;

  return (
    <>
      <Loader isVisible={false} />
      {!isPortal && <Navbar />}
      {!isPortal && <CartDrawer />}

      <Suspense fallback={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div className="spinner" />
        </div>
      }>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/about" element={<AboutPage />} />

          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/register" element={<AdminRegisterPage />} />
          <Route path="/rider/login" element={<RiderLoginPage />} />
          <Route path="/auth/google/success" element={<GoogleAuthSuccess />} />

          {/* User protected */}
          <Route path="/cart" element={<ProtectedRoute roles={['user']}><CartPage /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute roles={['user']}><CheckoutPage /></ProtectedRoute>} />
          <Route path="/order-success/:id" element={<ProtectedRoute roles={['user']}><OrderSuccessPage /></ProtectedRoute>} />
          <Route path="/track/:id" element={<ProtectedRoute roles={['user']}><OrderTrackingPage /></ProtectedRoute>} />
          <Route path="/account" element={<ProtectedRoute roles={['user']}><AccountPage /></ProtectedRoute>} />
          <Route path="/account/orders" element={<ProtectedRoute roles={['user']}><OrdersPage /></ProtectedRoute>} />
          <Route path="/account/wishlist" element={<ProtectedRoute roles={['user']}><WishlistPage /></ProtectedRoute>} />

          {/* Admin protected */}
          <Route path="/admin" element={<ProtectedRoute roles={['admin', 'superadmin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/products" element={<ProtectedRoute roles={['admin', 'superadmin']}><AdminProducts /></ProtectedRoute>} />
          <Route path="/admin/products/add" element={<ProtectedRoute roles={['admin', 'superadmin']}><AdminAddProduct /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute roles={['admin', 'superadmin']}><AdminOrders /></ProtectedRoute>} />
          <Route path="/admin/riders" element={<ProtectedRoute roles={['admin', 'superadmin']}><AdminRiders /></ProtectedRoute>} />

          {/* Rider protected */}
          <Route path="/rider" element={<ProtectedRoute roles={['rider']}><RiderDashboard /></ProtectedRoute>} />
          <Route path="/rider/orders" element={<ProtectedRoute roles={['rider']}><RiderOrders /></ProtectedRoute>} />

          {/* Super Admin protected */}
          <Route path="/superadmin" element={<ProtectedRoute roles={['superadmin']}><SuperAdminDashboard /></ProtectedRoute>} />
          <Route path="/superadmin/users" element={<ProtectedRoute roles={['superadmin']}><SuperAdminUsers /></ProtectedRoute>} />
          <Route path="/superadmin/approvals" element={<ProtectedRoute roles={['superadmin']}><SuperAdminApprovals /></ProtectedRoute>} />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>

      {!isPortal && <Footer />}
    </>
  );
}

export default App;
