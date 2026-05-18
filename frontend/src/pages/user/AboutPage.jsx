import { motion } from 'framer-motion';
import { ShieldCheck, Truck, Award, Users, ShoppingBag, Landmark } from 'lucide-react';
import banner from '../../assets/logo.png';

const AboutPage = () => {
  const pillars = [
    {
      title: 'Premium Authenticity',
      desc: 'Every vendor and product is manually audited and approved by our system admins to guarantee authentic top-notch materials.',
      icon: Award,
      color: 'linear-gradient(135deg,#C9A84C,#a8862e)'
    },
    {
      title: 'Express Doorstep Delivery',
      desc: 'Our hand-selected network of active, approved local riders ensures that your luxury parcels reach you safely within 2-4 business days.',
      icon: Truck,
      color: 'linear-gradient(135deg,#0D1B3E,#1a2f5e)'
    },
    {
      title: 'Secure Checkout & Chat',
      desc: 'We support secure online banking payments alongside instant two-way Customer-Rider chat for real-time order updates.',
      icon: ShieldCheck,
      color: 'linear-gradient(135deg,#16a34a,#15803d)'
    }
  ];

  return (
    <div style={{ paddingTop: 100, paddingBottom: 80, minHeight: '100vh', background: 'var(--off-white)' }}>
      {/* Hero Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0D1B3E 0%, #1a2f5e 100%)',
        color: 'white',
        padding: '80px 20px',
        textAlign: 'center',
        borderBottom: '4px solid var(--gold)',
        marginBottom: 60
      }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <motion.img 
            src={banner} 
            alt="Grand Bazaar" 
            style={{ height: 100, margin: '0 auto 24px', filter: 'drop-shadow(0 4px 12px rgba(251, 191, 36, 0.45))' }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />
          <motion.h1 
            style={{ fontFamily: 'Playfair Display, serif', fontSize: '3rem', color: 'var(--gold)', marginBottom: 16 }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Grand Bazaar
          </motion.h1>
          <motion.p 
            style={{ fontSize: '1.2rem', opacity: 0.85, fontWeight: 300, lineHeight: 1.6 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Pakistan's Premium Digital Online Marketplace. Merging centuries of trading legacy with state-of-the-art secure full-stack logistics.
          </motion.p>
        </div>
      </div>

      {/* Main Core pillars and values */}
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--navy)', marginBottom: 12 }}>Our Core Pillars</h2>
          <div style={{ width: 60, height: 4, background: 'var(--gold)', margin: '0 auto', borderRadius: 999 }} />
        </div>

        <div className="grid grid-3" style={{ marginBottom: 60 }}>
          {pillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div 
                key={p.title} 
                className="card" 
                style={{ padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
              >
                <div style={{ 
                  background: p.color, 
                  width: 56, 
                  height: 56, 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  marginBottom: 20,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                  <Icon size={26} color="white" />
                </div>
                <h4 style={{ color: 'var(--navy)', marginBottom: 12 }}>{p.title}</h4>
                <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>{p.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Brand Legacy Story */}
        <motion.div 
          className="card" 
          style={{ padding: '50px 40px', background: 'white', border: '1px solid var(--gray-200)' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-2" style={{ alignItems: 'center', gap: 40 }}>
            <div>
              <h3 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--navy)', marginBottom: 16 }}>
                The Digital Renaissance
              </h3>
              <p className="text-muted" style={{ fontSize: '0.95rem', lineHeight: 1.7, marginBottom: 20 }}>
                Grand Bazaar was built with a single vision in mind: to digitalize the premium, custom craftsmanship of high-end Pakistani boutiques and bring them safely to shoppers' homes. 
              </p>
              <p className="text-muted" style={{ fontSize: '0.95rem', lineHeight: 1.7 }}>
                By establishing clear admin approval queues, verifying logistics partners, and integrating modern secure bank transfers, we provide a premium e-commerce portal that protects customers, supports riders, and gives boutique sellers the digital reach they deserve.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div style={{ padding: 24, background: 'var(--gray-50)', borderRadius: 'var(--radius)', textAlign: 'center' }}>
                <ShoppingBag size={32} style={{ color: 'var(--gold-dark)', marginBottom: 12 }} />
                <h5 style={{ color: 'var(--navy)', margin: 0 }}>Premium Stores</h5>
                <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: 4 }}>Boutique Approved Products</p>
              </div>
              <div style={{ padding: 24, background: 'var(--gray-50)', borderRadius: 'var(--radius)', textAlign: 'center' }}>
                <Users size={32} style={{ color: 'var(--gold-dark)', marginBottom: 12 }} />
                <h5 style={{ color: 'var(--navy)', margin: 0 }}>Active Riders</h5>
                <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: 4 }}>Verified Logistics Partners</p>
              </div>
              <div style={{ padding: 24, background: 'var(--gray-50)', borderRadius: 'var(--radius)', textAlign: 'center' }}>
                <Landmark size={32} style={{ color: 'var(--gold-dark)', marginBottom: 12 }} />
                <h5 style={{ color: 'var(--navy)', margin: 0 }}>Secure Escrow</h5>
                <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: 4 }}>100% Secure Checkout</p>
              </div>
              <div style={{ padding: 24, background: 'var(--gray-50)', borderRadius: 'var(--radius)', textAlign: 'center' }}>
                <ShieldCheck size={32} style={{ color: 'var(--gold-dark)', marginBottom: 12 }} />
                <h5 style={{ color: 'var(--navy)', margin: 0 }}>System Audited</h5>
                <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: 4 }}>Verified Platform Integrity</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
