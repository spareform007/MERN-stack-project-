import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  Drawer,
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
  Avatar,
  Paper,
  Chip
} from '@mui/material';
import { Close, Send, SupportAgent, AutoAwesome } from '@mui/icons-material';
import io from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';

let socket;

export default function LiveChatWidget({ open, onClose }) {
  const { user } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (open) {
      const socketUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : window.location.origin;
      socket = io(socketUrl);

      const userName = user?.name || 'Valued Guest';
      const role = user?.role || 'customer';

      socket.emit('join_chat', { userId: user?._id || 'guest', userName, role });

      socket.on('receive_message', (msg) => {
        setMessages((prev) => [...prev, msg]);
      });
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [open, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const msgData = {
      userName: user?.name || 'Valued Guest',
      role: user?.role || 'customer',
      text: inputText.trim()
    };

    if (socket) {
      socket.emit('send_message', msgData);
    }
    setInputText('');
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: { xs: 320, sm: 380 }, height: '100%', bgcolor: '#0D0D0D', color: '#FFF', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box p={2.5} sx={{ bgcolor: '#141414', borderBottom: '1px solid rgba(212, 175, 55, 0.25)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Avatar sx={{ bgcolor: '#D4AF37', color: '#0D0D0D' }}>
              <SupportAgent />
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ color: '#D4AF37', fontWeight: 700, fontFamily: 'Playfair Display' }}>
                MAE' Beauty Concierge
              </Typography>
              <Typography variant="caption" sx={{ color: '#00E676', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                ● Live Artist Available
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} sx={{ color: '#FFF' }}><Close /></IconButton>
        </Box>

        {/* Message History */}
        <Box flexGrow={1} p={2} sx={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Chip
            icon={<AutoAwesome style={{ color: '#D4AF37' }} />}
            label="Encrypted Private Beauty Salon Chat"
            size="small"
            sx={{ bgcolor: 'rgba(212, 175, 55, 0.1)', color: '#D4AF37', border: '1px solid rgba(212, 175, 55, 0.2)', mx: 'auto', my: 1 }}
          />

          {messages.map((msg, idx) => {
            const isMe = msg.sender === (user?.name || 'Valued Guest');
            return (
              <Box
                key={idx}
                sx={{
                  alignSelf: isMe ? 'flex-end' : 'flex-start',
                  maxWidth: '85%'
                }}
              >
                <Typography variant="caption" sx={{ color: '#666', px: 0.5, display: 'block', textAlign: isMe ? 'right' : 'left' }}>
                  {msg.sender} ({msg.role}) • {msg.timestamp}
                </Typography>
                <Paper
                  sx={{
                    p: 1.5,
                    bgcolor: isMe ? '#D4AF37' : '#1C1C1C',
                    color: isMe ? '#0D0D0D' : '#FFF',
                    borderRadius: isMe ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                  }}
                >
                  <Typography variant="body2">{msg.text}</Typography>
                </Paper>
              </Box>
            );
          })}
          <div ref={messagesEndRef} />
        </Box>

        {/* Message Input */}
        <Box component="form" onSubmit={handleSend} p={2} sx={{ bgcolor: '#141414', borderTop: '1px solid rgba(212, 175, 55, 0.2)' }}>
          <Box display="flex" gap={1}>
            <TextField
              size="small"
              fullWidth
              placeholder="Ask about foundation shade or formula..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              sx={{
                bgcolor: 'rgba(255,255,255,0.05)',
                input: { color: '#FFF' },
                '& fieldset': { borderColor: 'rgba(212, 175, 55, 0.3)' }
              }}
            />
            <Button type="submit" variant="contained" sx={{ minWidth: 50, px: 0 }}>
              <Send fontSize="small" />
            </Button>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}
