import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Placeholder auth: store dummy token to unlock protected routes
      localStorage.setItem('accessToken', 'demo');
      const to = location.state?.from?.pathname || '/profile';
      navigate(to, { replace: true });
    } catch (err) {
      setError('Ошибка входа.');
    }
  };

  return (
    <section data-easytag="id8-src/pages/Login.jsx" style={{ maxWidth: 420, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>Вход</h1>
      {error ? <div role="alert" style={{ color: '#b00020', marginBottom: 12 }}>{error}</div> : null}
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
        <div style={{ display: 'grid', gap: 6 }}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ height: 42, borderRadius: 8, border: '1px solid #ddd', padding: '0 12px' }} />
        </div>
        <div style={{ display: 'grid', gap: 6 }}>
          <label htmlFor="password">Пароль</label>
          <input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ height: 42, borderRadius: 8, border: '1px solid #ddd', padding: '0 12px' }} />
        </div>
        <button type="submit" style={{ height: 44, borderRadius: 10, border: '1px solid #000', background: '#000', color: '#fff', cursor: 'pointer' }}>Войти</button>
      </form>
      <p style={{ marginTop: 12 }}>Нет аккаунта? <Link to="/register">Зарегистрируйтесь</Link></p>
    </section>
  );
}
