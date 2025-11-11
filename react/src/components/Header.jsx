import React, { useMemo } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

function useAuth() {
  const isAuthed = useMemo(() => {
    try {
      return Boolean(localStorage.getItem('accessToken'));
    } catch (e) {
      return false;
    }
  }, []);
  return { isAuthed };
}

export default function Header() {
  const { isAuthed } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } catch (e) {
      // ignore
    }
    navigate('/');
  };

  const linkStyle = ({ isActive }) => ({
    color: isActive ? '#000' : '#333',
    textDecoration: 'none',
    fontWeight: isActive ? 600 : 500,
    padding: '8px 10px',
  });

  return (
    <header data-easytag="id1-src/components/Header.jsx" style={{
      width: '100%',
      borderBottom: '1px solid #eee',
      position: 'sticky',
      top: 0,
      background: '#fff',
      zIndex: 20,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 64,
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 16px',
      }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div aria-hidden style={{ width: 20, height: 20, borderRadius: 6, background: '#000' }} />
          <span style={{ color: '#000', fontSize: 18, fontWeight: 700 }}>Доска</span>
        </Link>

        {!isAuthed ? (
          <nav aria-label="Main navigation">
            <NavLink to="/login" style={linkStyle}>Войти</NavLink>
            <NavLink to="/register" style={linkStyle}>Зарегистрироваться</NavLink>
          </nav>
        ) : (
          <nav aria-label="User navigation" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <NavLink to="/ads/new" style={linkStyle}>Новое объявление</NavLink>
            <NavLink to="/my" style={linkStyle}>Мои объявления</NavLink>
            <NavLink to="/favorites" style={linkStyle}>Избранное</NavLink>
            <NavLink to="/profile" style={linkStyle}>Профиль</NavLink>
            <button type="button" onClick={handleLogout} style={{
              marginLeft: 8,
              padding: '8px 12px',
              border: '1px solid #ddd',
              background: '#fafafa',
              borderRadius: 8,
              cursor: 'pointer',
            }}>
              Выйти
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}
