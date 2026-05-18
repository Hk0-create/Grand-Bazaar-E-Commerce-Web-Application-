import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, UserPlus } from 'lucide-react';
import { registerUser } from '../../store/slices/authSlice.js';
import logo from '../../assets/logo.png';
import './AuthPages.css';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((s) => s.auth);
  const [showPass, setShowPass] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    const result = await dispatch(registerUser({ name: data.name, email: data.email, password: data.password }));
    if (registerUser.fulfilled.match(result)) navigate('/');
  };

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-left hide-mobile">
        <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="auth-left-content">
          <img src={logo} alt="Grand Bazaar" className="auth-logo-big" />
          <h2>Join Grand Bazaar!</h2>
          <p>Create your account and unlock the world of premium shopping</p>
          <ul className="auth-perks">
            {['Free account setup', 'Exclusive deals & discounts', 'Real-time order tracking', 'Secure & fast checkout'].map((p) => (
              <li key={p}>✦ {p}</li>
            ))}
          </ul>
        </motion.div>
      </div>

      <div className="auth-right">
        <motion.div className="auth-card glass-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="auth-card-header">
            <img src={logo} alt="Grand Bazaar" className="auth-logo-sm hide-desktop" />
            <h3>Create Account</h3>
            <p>Start your shopping journey today</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-icon-wrap">
                <User size={18} className="input-icon" />
                <input type="text" className={`form-input input-with-icon ${errors.name ? 'error' : ''}`}
                  placeholder="John Doe"
                  {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Name too short' } })} />
              </div>
              {errors.name && <span className="form-error">{errors.name.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-icon-wrap">
                <Mail size={18} className="input-icon" />
                <input type="email" className={`form-input input-with-icon ${errors.email ? 'error' : ''}`}
                  placeholder="you@example.com"
                  {...register('email', { required: 'Email is required' })} />
              </div>
              {errors.email && <span className="form-error">{errors.email.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-icon-wrap">
                <Lock size={18} className="input-icon" />
                <input type={showPass ? 'text' : 'password'} className={`form-input input-with-icon input-with-icon-right ${errors.password ? 'error' : ''}`}
                  placeholder="Min 6 characters"
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password min 6 chars' } })} />
                <button type="button" className="input-icon-right" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="input-icon-wrap">
                <Lock size={18} className="input-icon" />
                <input type="password" className={`form-input input-with-icon ${errors.confirm ? 'error' : ''}`}
                  placeholder="Repeat password"
                  {...register('confirm', { validate: (v) => v === watch('password') || 'Passwords do not match' })} />
              </div>
              {errors.confirm && <span className="form-error">{errors.confirm.message}</span>}
            </div>

            <motion.button type="submit" className="btn btn-gold" style={{ width: '100%', justifyContent: 'center' }}
              disabled={loading} whileTap={{ scale: 0.97 }}>
              {loading ? <div className="spinner-gold" style={{ width: 20, height: 20, borderWidth: 2 }} /> : <><UserPlus size={18} /> Create Account</>}
            </motion.button>

            <div className="auth-divider"><span>or</span></div>
            <a href="/api/auth/google" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', gap: 10 }}>
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </a>
          </form>
          <div className="auth-footer-links">
            <p>Already have an account? <Link to="/login">Sign In</Link></p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
