import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateCartItem, removeCartItem, clearCart } from '../../store/slices/cartSlice.js';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import logo from '../../assets/logo.png';

const CartPage = () => {
  const dispatch = useDispatch();
  const { items, totalAmount } = useSelector((s) => s.cart);

  return (
    <div style={{ paddingTop: 90, minHeight: '100vh' }}>
      <div className="container section">
        <h1 style={{ color: 'var(--navy)', marginBottom: 32 }}>Shopping Cart</h1>
        {items.length === 0 ? (
          <div className="card card-body" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <img src={logo} alt="Grand Bazaar" style={{ width: 120, margin: '0 auto 20px' }} />
            <h3>Your cart is empty</h3>
            <p className="text-muted mt-2 mb-6">Looks like you haven't added anything yet</p>
            <Link to="/products" className="btn btn-gold">Start Shopping</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {items.map((item) => (
                <div key={item._id} className="card card-body flex gap-4">
                  <img src={item.product?.images?.[0]} alt={item.product?.name}
                    style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--gray-200)' }} />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ color: 'var(--navy)', marginBottom: 4 }}>{item.product?.name}</h4>
                    {item.color && <p className="text-muted" style={{ fontSize: '0.85rem' }}>Color: {item.color}</p>}
                    {item.size && <p className="text-muted" style={{ fontSize: '0.85rem' }}>Size: {item.size}</p>}
                    <p style={{ fontWeight: 700, color: 'var(--navy)', marginTop: 8 }}>Rs. {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button onClick={() => dispatch(updateCartItem({ itemId: item._id, quantity: Math.max(1, item.quantity - 1) }))}
                        style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--gray-200)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Minus size={14} />
                      </button>
                      <span style={{ fontWeight: 600, minWidth: 24, textAlign: 'center' }}>{item.quantity}</span>
                      <button onClick={() => dispatch(updateCartItem({ itemId: item._id, quantity: item.quantity + 1 }))}
                        style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--gray-200)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Plus size={14} />
                      </button>
                    </div>
                    <button onClick={() => dispatch(removeCartItem(item._id))} style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer' }}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="card card-body" style={{ position: 'sticky', top: 90 }}>
              <h4 style={{ color: 'var(--navy)', marginBottom: 20 }}>Order Summary</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span className="text-muted">Subtotal</span>
                <span style={{ fontWeight: 600 }}>Rs. {totalAmount?.toLocaleString()}</span>
              </div>
              <div style={{ borderTop: '1px solid var(--gray-200)', paddingTop: 12, marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Total</span>
                <span style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--navy)' }}>Rs. {totalAmount?.toLocaleString()}</span>
              </div>
              <Link to="/checkout" className="btn btn-gold mt-6" style={{ width: '100%', justifyContent: 'center' }}>
                Checkout <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
