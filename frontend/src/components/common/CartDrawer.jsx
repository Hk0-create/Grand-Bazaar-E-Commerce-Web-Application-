import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { closeCart } from '../../store/slices/uiSlice.js';
import { updateCartItem, removeCartItem } from '../../store/slices/cartSlice.js';
import './CartDrawer.css';

const CartDrawer = () => {
  const dispatch = useDispatch();
  const { cartOpen } = useSelector((s) => s.ui);
  const { items, totalAmount } = useSelector((s) => s.cart);
  const { user } = useSelector((s) => s.auth);

  const handleQtyChange = (itemId, delta, currentQty) => {
    const newQty = currentQty + delta;
    if (newQty < 1) dispatch(removeCartItem(itemId));
    else dispatch(updateCartItem({ itemId, quantity: newQty }));
  };

  return (
    <>
      <AnimatePresence>
        {cartOpen && (
          <motion.div className="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => dispatch(closeCart())} />
        )}
      </AnimatePresence>

      <motion.div
        className="cart-drawer"
        initial={{ x: '100%' }}
        animate={{ x: cartOpen ? 0 : '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="cart-drawer-header">
          <div className="flex gap-2 items-center">
            <ShoppingBag size={22} />
            <h3>Your Cart</h3>
            {items.length > 0 && <span className="badge badge-gold">{items.length}</span>}
          </div>
          <button onClick={() => dispatch(closeCart())} className="cart-close-btn"><X size={20} /></button>
        </div>

        <div className="cart-drawer-body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <ShoppingBag size={64} strokeWidth={1} />
              </motion.div>
              <h4>Your cart is empty</h4>
              <p>Add some products to get started!</p>
              <Link to="/products" className="btn btn-gold btn-sm" onClick={() => dispatch(closeCart())}>
                Shop Now
              </Link>
            </div>
          ) : (
            <div className="cart-items-list">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div key={item._id} className="cart-item"
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20, height: 0 }}
                    layout
                  >
                    <img
                      src={item.product?.images?.[0] || '/placeholder.png'}
                      alt={item.product?.name}
                      className="cart-item-img"
                    />
                    <div className="cart-item-info">
                      <p className="cart-item-name">{item.product?.name || 'Product'}</p>
                      {item.color && <span className="cart-item-meta">Color: {item.color}</span>}
                      {item.size && <span className="cart-item-meta">Size: {item.size}</span>}
                      <p className="cart-item-price">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                    <div className="cart-item-actions">
                      <div className="qty-controls">
                        <button onClick={() => handleQtyChange(item._id, -1, item.quantity)}><Minus size={14} /></button>
                        <span>{item.quantity}</span>
                        <button onClick={() => handleQtyChange(item._id, 1, item.quantity)}><Plus size={14} /></button>
                      </div>
                      <button className="cart-item-remove" onClick={() => dispatch(removeCartItem(item._id))}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-total-row">
              <span>Subtotal</span>
              <span className="cart-total-amt">Rs. {totalAmount?.toLocaleString()}</span>
            </div>
            <p className="cart-shipping-note">Delivery charges calculated at checkout</p>
            {user ? (
              <Link to="/checkout" className="btn btn-gold" style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => dispatch(closeCart())}>
                Proceed to Checkout <ArrowRight size={18} />
              </Link>
            ) : (
              <Link to="/login" className="btn btn-navy" style={{ width: '100%', justifyContent: 'center', background: '#0D1B3E', color: 'white' }}
                onClick={() => dispatch(closeCart())}>
                Login to Checkout
              </Link>
            )}
            <Link to="/cart" className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
              onClick={() => dispatch(closeCart())}>
              View Full Cart
            </Link>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default CartDrawer;
