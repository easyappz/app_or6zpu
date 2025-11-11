import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function extractErrorMessage(err) {
  const data = err?.response?.data;
  if (data) {
    if (typeof data.detail === 'string') return data.detail;
    if (typeof data === 'object') {
      const msgs = [];
      for (const key of Object.keys(data)) {
        const val = data[key];
        if (Array.isArray(val)) {
          for (const item of val) msgs.push(String(item));
        } else if (typeof val === 'string') {
          msgs.push(val);
        }
      }
      if (msgs.length) return msgs.join(' ');
    }
  }
  return 'Ошибка входа. Проверьте введённые данные.';
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      // Redirect is handled inside AuthContext.login -> '/profile'
    } catch (err) {
      setError(extractErrorMessage(err));
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
        <button type="submit" disabled={loading} style={{ height: 44, borderRadius: 10, border: '1px solid #000', background: '#000', color: '#fff', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Входим…' : 'Войти'}
        </button>
      </form>
      <p style={{ marginTop: 12 }}>Нет аккаунта? <Link to="/register">Зарегистрируйтесь</Link></p>
    </section>
  );
}
