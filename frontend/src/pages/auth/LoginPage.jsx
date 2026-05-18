import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import { loginUser } from '../../store/slices/authSlice.js';
import logo from '../../assets/logo.png';
import './AuthPages.css';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((s) => s.auth);
  const [showPass, setShowPass] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    const result = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(result)) {
      const role = result.payload.user.role;
      if (role === 'superadmin') navigate('/superadmin');
      else if (role === 'admin') navigate('/admin');
      else if (role === 'rider') navigate('/rider');
      else navigate('/');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-left hide-mobile">
        <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="auth-left-content">
          <img src={logo} alt="Grand Bazaar" className="auth-logo-big" />
          <h2>Welcome Back!</h2>
          <p>Sign in to continue shopping at Grand Bazaar — Pakistan's Premium Marketplace</p>
          <div className="auth-left-stats">
            {[['50K+', 'Happy Customers'], ['10K+', 'Products'], ['99%', 'Satisfaction']].map(([n, l]) => (
              <div key={l} className="auth-stat"><span>{n}</span><small>{l}</small></div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="auth-right">
        <motion.div className="auth-card glass-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="auth-card-header">
            <img src={logo} alt="Grand Bazaar" className="auth-logo-sm hide-desktop" />
            <h3>Sign In</h3>
            <p>Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-icon-wrap">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  className={`form-input input-with-icon ${errors.email ? 'error' : ''}`}
                  placeholder="you@example.com"
                  {...register('email', { required: 'Email is required' })}
                />
              </div>
              {errors.email && <span className="form-error">{errors.email.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-icon-wrap">
                <Lock size={18} className="input-icon" />
                <input
                  type={showPass ? 'text' : 'password'}
                  className={`form-input input-with-icon input-with-icon-right ${errors.password ? 'error' : ''}`}
                  placeholder="Your password"
                  {...register('password', { required: 'Password is required' })}
                />
                <button type="button" className="input-icon-right" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password.message}</span>}
            </div>

            <motion.button
              type="submit"
              className="btn btn-gold"
              style={{ width: '100%', justifyContent: 'center' }}
              disabled={loading}
              whileTap={{ scale: 0.97 }}
            >
              {loading ? <div className="spinner-gold" style={{ width: 20, height: 20, borderWidth: 2 }} /> : <><LogIn size={18} /> Sign In</>}
            </motion.button>

            <div className="auth-divider"><span>or</span></div>

            <a href="/api/auth/google" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', gap: 10 }}>
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </a>
          </form>

          <div className="auth-footer-links">
            <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
            <p>Admin/Rider? <Link to="/admin/login">Admin Login</Link></p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
