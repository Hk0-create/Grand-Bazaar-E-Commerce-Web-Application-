import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Shield } from 'lucide-react';
import { loginUser } from '../../store/slices/authSlice.js';
import logo from '../../assets/logo.png';
import './AuthPages.css';

const AdminLoginPage = () => {
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
      <div className="auth-right" style={{ flex: 1 }}>
        <motion.div className="auth-card" style={{ maxWidth: 440 }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <div className="auth-card-header">
            <img src={logo} alt="Grand Bazaar" style={{ height: 64, margin: '0 auto 16px' }} />
            <span className="admin-login-badge"><Shield size={14} /> Admin Portal</span>
            <h3>Admin Sign In</h3>
            <p>Sign in to manage Grand Bazaar</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email</label>
              <div className="input-icon-wrap">
                <Mail size={18} className="input-icon" />
                <input type="email" className={`form-input input-with-icon ${errors.email ? 'error' : ''}`}
                  placeholder="admin@grandbazaar.pk"
                  {...register('email', { required: 'Email required' })} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-icon-wrap">
                <Lock size={18} className="input-icon" />
                <input type={showPass ? 'text' : 'password'} className={`form-input input-with-icon input-with-icon-right`}
                  placeholder="Password"
                  {...register('password', { required: 'Password required' })} />
                <button type="button" className="input-icon-right" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <motion.button type="submit" className="btn btn-gold" style={{ width: '100%', justifyContent: 'center' }}
              disabled={loading} whileTap={{ scale: 0.97 }}>
              {loading ? <div className="spinner-gold" style={{ width: 20, height: 20, borderWidth: 2 }} /> : 'Sign In to Admin'}
            </motion.button>
          </form>
          <div className="auth-footer-links">
            <p><Link to="/rider/login">Rider Login</Link> · <Link to="/login">Customer Login</Link></p>
            <p>Need an account? <Link to="/admin/register">Request Admin Access</Link></p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
