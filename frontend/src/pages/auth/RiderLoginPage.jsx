import logo from '../../assets/logo.png';
import './AuthPages.css';
import { Link } from 'react-router-dom';

const RiderLoginPage = () => (
  <div className="auth-page">
    <div className="auth-bg" />
    <div className="auth-right" style={{ flex: 1 }}>
      <div className="auth-card" style={{ maxWidth: 440, padding: 36 }}>
        <div className="auth-card-header">
          <img src={logo} alt="Grand Bazaar" style={{ height: 64, margin: '0 auto 16px' }} />
          <h3>Rider Portal</h3>
          <p>Use your Admin Login credentials for rider login</p>
        </div>
        <div className="auth-footer-links">
          <Link to="/admin/login" className="btn btn-gold" style={{ width: '100%', justifyContent: 'center' }}>Go to Login</Link>
          <p style={{ marginTop: 12 }}><Link to="/login">Customer Login</Link></p>
        </div>
      </div>
    </div>
  </div>
);

export default RiderLoginPage;
