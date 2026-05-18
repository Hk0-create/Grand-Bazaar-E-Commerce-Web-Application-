import { motion, AnimatePresence } from 'framer-motion';
import logo from '../../assets/logo.png';
import './Loader.css';

const Loader = ({ isVisible = true }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="page-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
        >
          <motion.div
            className="loader-logo-wrap"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <motion.img
              src={logo}
              alt="Grand Bazaar"
              animate={{ scale: [1, 1.06, 1], opacity: [1, 0.85, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>

          <motion.div
            className="loader-text"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <span className="loader-brand">Grand Bazaar</span>
            <span className="loader-tagline">Premium Online Marketplace</span>
          </motion.div>

          <motion.div
            className="loader-bar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.div
              className="loader-bar-fill"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.8, ease: 'easeInOut', repeat: Infinity }}
            />
          </motion.div>

          {/* Floating particles */}
          <div className="loader-particles">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="loader-particle"
                initial={{ opacity: 0, y: 0, x: 0 }}
                animate={{
                  opacity: [0, 0.6, 0],
                  y: [-20, -80 - i * 20],
                  x: [(i % 2 === 0 ? -1 : 1) * i * 15, (i % 2 === 0 ? 1 : -1) * i * 10],
                }}
                transition={{ duration: 2.5, delay: i * 0.3, repeat: Infinity, ease: 'easeOut' }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;
