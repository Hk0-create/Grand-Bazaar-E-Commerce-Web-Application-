import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, Truck, ArrowRight, ShoppingBag } from 'lucide-react';
import confetti from 'canvas-confetti';

const OrderSuccessPage = () => {
  const { id } = useParams();

  useEffect(() => {
    // Celebration effect
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ paddingTop: 120, paddingBottom: 80, minHeight: '100vh', background: 'var(--gray-50)' }}>
      <div className="container" style={{ maxWidth: 600 }}>
        <motion.div 
          className="card" 
          style={{ textAlign: 'center', padding: '60px 40px' }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div style={{ color: '#16a34a', marginBottom: 24, display: 'inline-flex' }}>
            <CheckCircle size={80} strokeWidth={1.5} />
          </div>
          
          <h1 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--navy)', fontSize: '2.5rem', marginBottom: 16 }}>
            Order Placed!
          </h1>
          <p className="text-muted" style={{ fontSize: '1.1rem', marginBottom: 32 }}>
            Thank you for your purchase. Your order <strong style={{ color: 'var(--navy)' }}>#{id?.slice(-8).toUpperCase()}</strong> has been successfully placed and is being processed.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 40 }}>
            <div className="card" style={{ padding: 20, background: 'var(--gray-50)', border: 'none' }}>
              <Package size={24} style={{ color: 'var(--gold-dark)', marginBottom: 12 }} />
              <h6 style={{ marginBottom: 4 }}>Processing</h6>
              <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>We are preparing your items</p>
            </div>
            <div className="card" style={{ padding: 20, background: 'var(--gray-50)', border: 'none' }}>
              <Truck size={24} style={{ color: 'var(--gold-dark)', marginBottom: 12 }} />
              <h6 style={{ marginBottom: 4 }}>Fast Delivery</h6>
              <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Estimated: 2-4 business days</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Link to={`/track/${id}`} className="btn btn-gold" style={{ width: '100%', justifyContent: 'center', gap: 8, padding: 16 }}>
              Track Your Order <ArrowRight size={18} />
            </Link>
            <Link to="/products" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', gap: 8, padding: 16 }}>
              <ShoppingBag size={18} /> Continue Shopping
            </Link>
          </div>

          <p style={{ marginTop: 32, fontSize: '0.85rem', color: 'var(--gray-400)' }}>
            A confirmation email has been sent to your registered address.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
