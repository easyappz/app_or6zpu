import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Context
import { AuthProvider } from './context/AuthContext.jsx';
import { ErrorsProvider } from './context/ErrorsContext.jsx';

// Components
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import GlobalErrors from './components/GlobalErrors.jsx';

// Pages
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';
import AdNew from './pages/AdNew.jsx';
import AdEdit from './pages/AdEdit.jsx';
import AdView from './pages/AdView.jsx';
import Favorites from './pages/Favorites.jsx';
import MyAds from './pages/MyAds.jsx';

const ROUTES = [
  '/',
  '/login',
  '/register',
  '/profile',
  '/ads/new',
  '/ads/:id/edit',
  '/ads/:id',
  '/favorites',
  '/my',
];

function App() {
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.handleRoutes === 'function') {
      window.handleRoutes(ROUTES);
    }
  }, []);

  return (
    <div data-easytag="id0-src/App.jsx" className="App" style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <BrowserRouter>
        <ErrorsProvider>
          <AuthProvider>
            <Header />
            <main style={{ flex: 1, width: '100%', maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
              <GlobalErrors />
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route element={<ProtectedRoute />}> 
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/ads/new" element={<AdNew />} />
                  <Route path="/ads/:id/edit" element={<AdEdit />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/my" element={<MyAds />} />
                </Route>

                <Route path="/ads/:id" element={<AdView />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </AuthProvider>
        </ErrorsProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
