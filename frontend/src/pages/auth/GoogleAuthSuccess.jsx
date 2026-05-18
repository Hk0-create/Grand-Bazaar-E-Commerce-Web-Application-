import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setToken, fetchMe } from '../../store/slices/authSlice.js';
import { fetchCart } from '../../store/slices/cartSlice.js';

const GoogleAuthSuccess = () => {
  const [params] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get('token');
    const role = params.get('role');
    if (token) {
      localStorage.setItem('gb_token', token);
      dispatch(setToken(token));
      dispatch(fetchMe()).then(() => {
        dispatch(fetchCart());
        if (role === 'superadmin') navigate('/superadmin');
        else if (role === 'admin') navigate('/admin');
        else if (role === 'rider') navigate('/rider');
        else navigate('/');
      });
    } else {
      navigate('/login');
    }
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0D1B3E' }}>
      <div className="spinner spinner-gold" style={{ width: 48, height: 48 }} />
    </div>
  );
};

export default GoogleAuthSuccess;
