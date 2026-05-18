import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Heart, Globe, Rss, Share2, AtSign } from 'lucide-react';
import logo from '../../assets/logo.png';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-wave" />
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <img src={logo} alt="Grand Bazaar" className="footer-logo" />
            <p className="footer-desc">
              Pakistan's Premium Online Marketplace. Discover thousands of products with fast delivery and secure payments.
            </p>
            <div className="footer-socials">
              {[Globe, AtSign, Share2, Rss].map((Icon, i) => (
                <motion.a key={i} href="#" className="social-btn" whileHover={{ scale: 1.15, y: -2 }} whileTap={{ scale: 0.95 }}>
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              {[['Home', '/'], ['Products', '/products'], ['Categories', '/categories'], ['About', '/about']].map(([label, path]) => (
                <li key={path}><Link to={path}>{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div className="footer-col">
            <h4>My Account</h4>
            <ul>
              {[['Login', '/login'], ['Register', '/register'], ['My Orders', '/account/orders'], ['Wishlist', '/account/wishlist'], ['Track Order', '/track']].map(([label, path]) => (
                <li key={path}><Link to={path}>{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4>Contact Us</h4>
            <ul className="footer-contact">
              <li><Mail size={16} /> support@grandbazaar.pk</li>
              <li><Phone size={16} /> +92 300 1234567</li>
              <li><MapPin size={16} /> Karachi, Pakistan</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="divider-gold" style={{ marginBottom: '20px' }} />
          <p>© {new Date().getFullYear()} Grand Bazaar. All rights reserved. Made with <Heart size={14} style={{ display: 'inline', color: '#C9A84C', verticalAlign: 'middle' }} /> in Pakistan.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
