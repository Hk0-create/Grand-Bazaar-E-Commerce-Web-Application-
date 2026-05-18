import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, X, MessageSquare } from 'lucide-react';
import api from '../../utils/api.js';
import toast from 'react-hot-toast';

const ChatBox = ({ orderId, recipientName, recipientRole, currentUser, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const fetchMessages = async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true);
      const { data } = await api.get(`/chat/${orderId}`);
      setMessages(data.messages || []);
    } catch (err) {
      console.error('Failed to fetch chat messages', err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchMessages(true);

    // Poll every 3 seconds for simulation of real-time chat
    const interval = setInterval(() => {
      fetchMessages(false);
    }, 3000);

    return () => clearInterval(interval);
  }, [orderId]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageText = newMessage;
    setNewMessage('');

    try {
      const { data } = await api.post(`/chat/${orderId}`, { message: messageText });
      setMessages((prev) => [...prev, data.message]);
    } catch (err) {
      toast.error('Failed to send message');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.95 }}
      style={{
        position: 'fixed', bottom: 24, right: 24,
        width: 380, height: 500,
        backgroundColor: 'white', borderRadius: 20,
        boxShadow: '0 10px 25px -5px rgba(13, 27, 62, 0.25), 0 8px 10px -6px rgba(13, 27, 62, 0.2)',
        display: 'flex', flexDirection: 'column', zIndex: 1001,
        overflow: 'hidden', border: '1px solid var(--gray-100)'
      }}
    >
      {/* Header */}
      <div style={{
        padding: '16px 20px', background: 'var(--navy)', color: 'white',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="nav-avatar-placeholder" style={{ width: 32, height: 32, fontSize: '0.85rem', margin: 0, background: 'var(--gold)' }}>
            {recipientName?.charAt(0)}
          </div>
          <div>
            <strong style={{ display: 'block', fontSize: '0.95rem' }}>{recipientName}</strong>
            <small style={{ color: 'rgba(255,255,255,0.7)', textTransform: 'capitalize' }}>{recipientRole}</small>
          </div>
        </div>
        <button 
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', padding: 4 }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Message Area */}
      <div style={{
        flex: 1, padding: 20, overflowY: 'auto',
        background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: 12
      }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <div className="spinner-gold" style={{ width: 24, height: 24 }} />
          </div>
        ) : messages.length === 0 ? (
          <div style={{
            textAlign: 'center', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--gray-400)'
          }}>
            <MessageSquare size={36} strokeWidth={1.5} style={{ marginBottom: 8 }} />
            <p style={{ margin: 0, fontSize: '0.85rem' }}>Start your conversation about the order.</p>
          </div>
        ) : (
          messages.map((m) => {
            const isMe = m.sender?._id === currentUser?._id;
            return (
              <div 
                key={m._id}
                style={{
                  display: 'flex', flexDirection: 'column',
                  alignSelf: isMe ? 'flex-end' : 'flex-start',
                  maxWidth: '75%'
                }}
              >
                <div style={{
                  padding: '10px 14px', borderRadius: 16,
                  borderBottomRightRadius: isMe ? 4 : 16,
                  borderBottomLeftRadius: isMe ? 16 : 4,
                  background: isMe ? 'linear-gradient(135deg, var(--gold-dark, #a8862e), var(--gold, #C9A84C))' : 'white',
                  color: isMe ? 'white' : 'var(--navy)',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  fontSize: '0.9rem', lineHeight: '1.4'
                }}>
                  {m.message}
                </div>
                <small style={{
                  fontSize: '0.7rem', color: 'var(--gray-400)',
                  marginTop: 2, alignSelf: isMe ? 'flex-end' : 'flex-start'
                }}>
                  {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </small>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form 
        onSubmit={handleSend}
        style={{
          padding: 16, background: 'white', borderTop: '1px solid var(--gray-100)',
          display: 'flex', gap: 10, alignItems: 'center'
        }}
      >
        <input 
          type="text" 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          style={{
            flex: 1, padding: '10px 16px', borderRadius: 24,
            border: '1px solid var(--gray-200)', fontSize: '0.9rem', outline: 'none',
            background: 'var(--gray-50)'
          }}
        />
        <button 
          type="submit"
          style={{
            background: 'var(--navy)', color: 'white', border: 'none',
            width: 38, height: 38, borderRadius: '50%', display: 'flex',
            alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <Send size={16} />
        </button>
      </form>
    </motion.div>
  );
};

export default ChatBox;
