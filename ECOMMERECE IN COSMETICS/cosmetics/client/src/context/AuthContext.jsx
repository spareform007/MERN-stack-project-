import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('userInfo');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
      } catch (e) {
        localStorage.removeItem('userInfo');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    setUser(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
    return data;
  };

  const register = async (name, email, password, role = 'customer') => {
    const { data } = await API.post('/auth/register', { name, email, password, role });
    setUser(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  const updateSkinProfile = async (profileData) => {
    const { data } = await API.put('/auth/skin-profile', profileData);
    const updated = { ...user, skinProfile: data.skinProfile };
    setUser(updated);
    localStorage.setItem('userInfo', JSON.stringify(updated));
    return data;
  };

  const toggleWishlist = async (productId) => {
    if (!user) return false;
    const { data } = await API.post(`/auth/wishlist/${productId}`);
    const updated = { ...user, wishlist: data.wishlist };
    setUser(updated);
    localStorage.setItem('userInfo', JSON.stringify(updated));
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, updateSkinProfile, toggleWishlist, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
