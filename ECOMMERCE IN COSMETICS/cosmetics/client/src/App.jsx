import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import luxuryTheme from './theme';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { CompareProvider } from './context/CompareContext';

import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import VirtualTryOnModal from './components/VirtualTryOnModal';
import AISkinToneMatcherModal from './components/AISkinToneMatcherModal';
import LiveChatWidget from './components/LiveChatWidget';
import ProductComparisonModal from './components/ProductComparisonModal';

import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartCheckoutPage from './pages/CartCheckoutPage';
import UserDashboardPage from './pages/UserDashboardPage';
import BeautyGuidesPage from './pages/BeautyGuidesPage';
import AIARStudioPage from './pages/AIARStudioPage';
import BrandStoryPage from './pages/BrandStoryPage';
import SupportTrackingPage from './pages/SupportTrackingPage';

// Expert pages
import ExpertDashboardPage from './pages/expert/ExpertDashboardPage';
import ExpertClientCRMPage from './pages/expert/ExpertClientCRMPage';
import ExpertRoutineBuilderPage from './pages/expert/ExpertRoutineBuilderPage';

// Admin pages
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isARTryOnOpen, setIsARTryOnOpen] = useState(false);
  const [arSelectedProduct, setArSelectedProduct] = useState(null);
  const [isAIMatcherOpen, setIsAIMatcherOpen] = useState(false);
  const [isLiveChatOpen, setIsLiveChatOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo(0, 0);
  };

  const openARTryOn = (product = null) => {
    setArSelectedProduct(product);
    setIsARTryOnOpen(true);
  };

  // Router Switch supporting RBAC Protected Routes
  const renderPage = () => {
    if (currentPath.startsWith('/product/')) {
      return <ProductDetailPage onOpenARTryOn={openARTryOn} navigate={navigate} />;
    }

    switch (currentPath) {
      case '/shop':
        return <ShopPage onOpenARTryOn={openARTryOn} navigate={navigate} />;
      case '/ai-ar-studio':
        return <AIARStudioPage navigate={navigate} />;
      case '/guides':
        return <BeautyGuidesPage navigate={navigate} />;
      case '/about':
        return <BrandStoryPage navigate={navigate} />;
      case '/support':
        return <SupportTrackingPage onOpenLiveChat={() => setIsLiveChatOpen(true)} />;
      case '/checkout':
        return (
          <ProtectedRoute allowedRoles={['customer', 'expert', 'admin']} navigate={navigate} onOpenAuth={() => setIsAuthOpen(true)}>
            <CartCheckoutPage navigate={navigate} />
          </ProtectedRoute>
        );
      case '/dashboard':
        return (
          <ProtectedRoute allowedRoles={['customer', 'expert', 'admin']} navigate={navigate} onOpenAuth={() => setIsAuthOpen(true)}>
            <UserDashboardPage onOpenARTryOn={openARTryOn} navigate={navigate} />
          </ProtectedRoute>
        );

      // Expert Workspace Sub-Routes
      case '/expert/dashboard':
      case '/expert':
        return (
          <ProtectedRoute allowedRoles={['expert', 'admin']} navigate={navigate} onOpenAuth={() => setIsAuthOpen(true)}>
            <ExpertDashboardPage navigate={navigate} />
          </ProtectedRoute>
        );
      case '/expert/client-crm':
        return (
          <ProtectedRoute allowedRoles={['expert', 'admin']} navigate={navigate} onOpenAuth={() => setIsAuthOpen(true)}>
            <ExpertClientCRMPage navigate={navigate} />
          </ProtectedRoute>
        );
      case '/expert/routine-builder':
        return (
          <ProtectedRoute allowedRoles={['expert', 'admin']} navigate={navigate} onOpenAuth={() => setIsAuthOpen(true)}>
            <ExpertRoutineBuilderPage navigate={navigate} />
          </ProtectedRoute>
        );

      // Executive Admin Workspace Sub-Routes
      case '/admin/analytics':
        return (
          <ProtectedRoute allowedRoles={['admin']} navigate={navigate} onOpenAuth={() => setIsAuthOpen(true)}>
            <AdminAnalyticsPage />
          </ProtectedRoute>
        );
      case '/admin/users':
        return (
          <ProtectedRoute allowedRoles={['admin']} navigate={navigate} onOpenAuth={() => setIsAuthOpen(true)}>
            <AdminUsersPage />
          </ProtectedRoute>
        );
      case '/admin/products':
        return (
          <ProtectedRoute allowedRoles={['admin']} navigate={navigate} onOpenAuth={() => setIsAuthOpen(true)}>
            <AdminProductsPage />
          </ProtectedRoute>
        );
      case '/admin/orders':
        return (
          <ProtectedRoute allowedRoles={['admin']} navigate={navigate} onOpenAuth={() => setIsAuthOpen(true)}>
            <AdminOrdersPage />
          </ProtectedRoute>
        );
      case '/admin':
        return (
          <ProtectedRoute allowedRoles={['admin', 'expert']} navigate={navigate} onOpenAuth={() => setIsAuthOpen(true)}>
            <AdminDashboardPage navigate={navigate} />
          </ProtectedRoute>
        );

      case '/':
      default:
        return <HomePage onOpenARTryOn={openARTryOn} onOpenAIMatcher={() => setIsAIMatcherOpen(true)} navigate={navigate} />;
    }
  };

  return (
    <ThemeProvider theme={luxuryTheme}>
      <CssBaseline />
      <AuthProvider>
        <CartProvider>
          <CompareProvider>
            <div className="min-h-screen flex flex-col bg-[#0D0D0D] text-white">
              <Navbar
                onOpenAuth={() => setIsAuthOpen(true)}
                onOpenLiveChat={() => setIsLiveChatOpen(true)}
                onOpenCompare={() => setIsCompareOpen(true)}
                navigate={navigate}
              />

              <main className="flex-grow">
                {renderPage()}
              </main>

              <Footer currentPath={currentPath} navigate={navigate} />

              {/* Modals & Drawers */}
              <CartDrawer navigate={navigate} />
              <AuthModal open={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
              <VirtualTryOnModal open={isARTryOnOpen} onClose={() => setIsARTryOnOpen(false)} initialProduct={arSelectedProduct} />
              <AISkinToneMatcherModal open={isAIMatcherOpen} onClose={() => setIsAIMatcherOpen(false)} navigate={navigate} />
              <LiveChatWidget open={isLiveChatOpen} onClose={() => setIsLiveChatOpen(false)} />
              <ProductComparisonModal open={isCompareOpen} onClose={() => setIsCompareOpen(false)} />
            </div>
          </CompareProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
