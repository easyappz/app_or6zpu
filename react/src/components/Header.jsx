import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMe } from '../api/members';

// Optional: use existing AuthContext if provided by the app
// We keep import in try/catch style by resolving at runtime to avoid hard crash
// if the context file path changes. We will fallback to local state.
// eslint-disable-next-line import/no-unresolved
import { AuthContext } from '../context/AuthContext.jsx';

function getInitials(name, email) {
  const source = (name || email || '').trim();
  if (!source) return 'U';
  const parts = source.split(' ').filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

const styles = {
  header: {
    position: 'sticky',
    top: 0,
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #eee',
    zIndex: 1000,
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  },
  container: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '20px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'",
    fontSize: 24,
    fontWeight: 700,
    letterSpacing: '-0.02em',
    color: '#111',
    textDecoration: 'none',
    padding: '6px 8px',
    borderRadius: 12,
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  loginBtn: {
    fontSize: 16,
    color: '#111',
    textDecoration: 'none',
    padding: '10px 16px',
    border: '1px solid '#e9e9e9',
    borderRadius: 9999,
    background: '#f9f9f9',
    lineHeight: 1,
  },
  profileWrap: {
    position: 'relative',
  },
  avatarBtn: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    border: '1px solid #e6e6e6',
    background: '#f3f3f3',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#111',
    fontWeight: 600,
    fontSize: 14,
    cursor: 'pointer',
  },
  dropdown: {
    position: 'absolute',
    right: 0,
    top: 'calc(100% + 10px)',
    minWidth: 220,
    background: '#fff',
    border: '1px solid #eaeaea',
    borderRadius: 14,
    boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
    padding: 8,
  },
  item: {
    display: 'block',
    width: '100%',
    textAlign: 'left',
    background: 'transparent',
    border: 'none',
    padding: '12px 12px',
    borderRadius: 10,
    fontSize: 16,
    color: '#111',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'transparent',
    zIndex: 999,
  },
};

export default function Header() {
  const navigate = useNavigate();
  const ctx = useContext(AuthContext);
  const [member, setMember] = useState(ctx?.member || null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('token');
  const rootRef = useRef(null);

  // Sync with context updates if they exist
  useEffect(() => {
    if (ctx?.member) {
      setMember(ctx.member);
    }
  }, [ctx?.member]);

  // Fetch /api/members/me if we have a token and no member yet
  useEffect(() => {
    let cancelled = false;
    async function fetchMe() {
      if (!hasToken || member) return;
      try {
        const meRes = await getMe();
        if (!cancelled) setMember(meRes?.data || null);
      } catch (e) {
        // Token invalid — ensure logged-out UI
        if (!cancelled) setMember(null);
      }
    }
    fetchMe();
    return () => {
      cancelled = true;
    };
  }, [hasToken, member]);

  // Close dropdown on outer click / ESC
  useEffect(() => {
    function onDocClick(e) {
      if (!dropdownOpen) return;
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    function onKey(e) {
      if (e.key === 'Escape') setDropdownOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [dropdownOpen]);

  const isAuthed = useMemo(() => {
    if (typeof ctx?.isAuthenticated === 'boolean') return ctx.isAuthenticated;
    return !!member && !!hasToken;
  }, [ctx?.isAuthenticated, member, hasToken]);

  function handleLogout() {
    try {
      if (ctx?.logout) ctx.logout();
    } catch (_) {
      // ignore
    }
    localStorage.removeItem('token');
    setMember(null);
    setDropdownOpen(false);
    navigate('/');
  }

  const initials = useMemo(() => getInitials(member?.name, member?.email), [member]);

  return (
    <header ref={rootRef} data-easytag="id1-src/components/Header.jsx" style={styles.header}>
      <div data-easytag="id2-src/components/Header.jsx-container" style={styles.container}>
        <Link to="/" data-easytag="id3-src/components/Header.jsx-logo" style={styles.logo} aria-label="На главную">
          Объявления
        </Link>

        <nav data-easytag="id4-src/components/Header.jsx-nav" style={styles.nav} aria-label="Основное меню">
          {!isAuthed && (
            <Link
              to="/login"
              data-easytag="id5-src/components/Header.jsx-login"
              style={styles.loginBtn}
            >
              Войти
            </Link>
          )}

          {isAuthed && (
            <div data-easytag="id6-src/components/Header.jsx-profile-wrap" style={styles.profileWrap}>
              <button
                type="button"
                data-easytag="id7-src/components/Header.jsx-profile-btn"
                style={styles.avatarBtn}
                onClick={() => setDropdownOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={dropdownOpen}
                title={member?.name || 'Профиль'}
              >
                <span data-easytag="id8-src/components/Header.jsx-avatar-initials" aria-hidden="true">{initials}</span>
              </button>

              {dropdownOpen && (
                <>
                  <div
                    data-easytag="id9-src/components/Header.jsx-backdrop"
                    style={styles.backdrop}
                    onClick={() => setDropdownOpen(false)}
                  />

                  <div data-easytag="id10-src/components/Header.jsx-dropdown" style={styles.dropdown} role="menu">
                    <Link
                      to="/profile"
                      data-easytag="id11-src/components/Header.jsx-menu-profile"
                      style={styles.item}
                      role="menuitem"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Профиль
                    </Link>
                    <Link
                      to="/my"
                      data-easytag="id12-src/components/Header.jsx-menu-my"
                      style={styles.item}
                      role="menuitem"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Мои объявления
                    </Link>
                    <Link
                      to="/favorites"
                      data-easytag="id13-src/components/Header.jsx-menu-fav"
                      style={styles.item}
                      role="menuitem"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Избранное
                    </Link>
                    <button
                      type="button"
                      data-easytag="id14-src/components/Header.jsx-menu-logout"
                      style={styles.item}
                      onClick={handleLogout}
                    >
                      Выйти
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
