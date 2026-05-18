import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ShieldCheck, Truck } from 'lucide-react';
import { registerAdmin } from '../../store/slices/authSlice.js';
import logo from '../../assets/logo.png';
import './AuthPages.css';

const AdminRegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((s) => s.auth);
  const [showPass, setShowPass] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { role: 'admin' }
  });

  const onSubmit = async (data) => {
    const result = await dispatch(registerAdmin(data));
    if (registerAdmin.fulfilled.match(result)) {
      setRequestSent(true);
    }
  };

  if (requestSent) {
    return (
      <div className="auth-page">
        <div className="auth-bg" />
        <div className="auth-right" style={{ flex: 1 }}>
          <motion.div className="auth-card" style={{ maxWidth: 480, textAlign: 'center' }}
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="success-icon-wrap" style={{ margin: '0 auto 24px', background: 'rgba(22, 163, 74, 0.1)', width: 80, height: 80, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
              <ShieldCheck size={40} />
            </div>
            <h3 style={{ color: 'var(--navy)', marginBottom: 12 }}>Request Submitted!</h3>
            <p className="text-muted" style={{ marginBottom: 32 }}>
              Your application for access has been sent to the Super Admin. You will be able to log in once your account is reviewed and approved.
            </p>
            <Link to="/admin/login" className="btn btn-gold" style={{ width: '100%', justifyContent: 'center' }}>
              Return to Login
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-right" style={{ flex: 1 }}>
        <motion.div className="auth-card" style={{ maxWidth: 500 }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <div className="auth-card-header">
            <img src={logo} alt="Grand Bazaar" style={{ height: 50, margin: '0 auto 16px' }} />
            <h3>Request Portal Access</h3>
            <p>Apply for an Admin or Rider account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            <div className="form-group">
              <label className="form-label">Account Type</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <label className={`role-option ${watch('role') === 'admin' ? 'active' : ''}`}>
                  <input type="radio" value="admin" {...register('role')} style={{ display: 'none' }} />
                  <ShieldCheck size={20} />
                  <span>Admin</span>
                </label>
                <label className={`role-option ${watch('role') === 'rider' ? 'active' : ''}`}>
                  <input type="radio" value="rider" {...register('role')} style={{ display: 'none' }} />
                  <Truck size={20} />
                  <span>Rider</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-icon-wrap">
                <User size={18} className="input-icon" />
                <input type="text" className={`form-input input-with-icon ${errors.name ? 'error' : ''}`}
                  placeholder="Enter your name"
                  {...register('name', { required: 'Name is required' })} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-icon-wrap">
                <Mail size={18} className="input-icon" />
                <input type="email" className={`form-input input-with-icon ${errors.email ? 'error' : ''}`}
                  placeholder="Enter your email"
                  {...register('email', { required: 'Email is required' })} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-icon-wrap">
                <Lock size={18} className="input-icon" />
                <input type={showPass ? 'text' : 'password'} className={`form-input input-with-icon input-with-icon-right ${errors.password ? 'error' : ''}`}
                  placeholder="Create a password"
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 chars' } })} />
                <button type="button" className="input-icon-right" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <motion.button type="submit" className="btn btn-gold" style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}
              disabled={loading} whileTap={{ scale: 0.97 }}>
              {loading ? <div className="spinner-gold" style={{ width: 20, height: 20, borderWidth: 2 }} /> : 'Send Request'}
            </motion.button>
          </form>

          <div className="auth-footer-links">
            <p>Already have an account? <Link to="/admin/login">Sign In</Link></p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminRegisterPage;
