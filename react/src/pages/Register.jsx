import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register as apiRegister } from '../api/auth';
import { getSpec } from '../api/openapi';

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
  return 'Ошибка регистрации. Проверьте введённые данные.';
}

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // ensure OpenAPI is available (non-blocking behavior is inside function)
      await getSpec();
      await apiRegister({ name, email, phone, password });
      navigate('/login', { replace: true });
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section data-easytag="id9-src/pages/Register.jsx" style={{ maxWidth: 480, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>Регистрация</h1>
      {error ? <div role="alert" style={{ color: '#b00020', marginBottom: 12 }}>{error}</div> : null}
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
        <div style={{ display: 'grid', gap: 6 }}>
          <label htmlFor="name">Имя</label>
          <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ height: 42, borderRadius: 8, border: '1px solid #ddd', padding: '0 12px' }} />
        </div>
        <div style={{ display: 'grid', gap: 6 }}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ height: 42, borderRadius: 8, border: '1px solid #ddd', padding: '0 12px' }} />
        </div>
        <div style={{ display: 'grid', gap: 6 }}>
          <label htmlFor="phone">Телефон</label>
          <input id="phone" type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required style={{ height: 42, borderRadius: 8, border: '1px solid #ddd', padding: '0 12px' }} />
        </div>
        <div style={{ display: 'grid', gap: 6 }}>
          <label htmlFor="password">Пароль</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ height: 42, borderRadius: 8, border: '1px solid #ddd', padding: '0 12px' }} />
        </div>
        <button type="submit" disabled={loading} style={{ height: 44, borderRadius: 10, border: '1px solid #000', background: '#000', color: '#fff', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Создаём…' : 'Создать аккаунт'}
        </button>
      </form>
      <p style={{ marginTop: 12 }}>Уже есть аккаунт? <Link to="/login">Войти</Link></p>
    </section>
  );
}
