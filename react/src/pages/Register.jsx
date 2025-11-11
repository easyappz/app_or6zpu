import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Placeholder registration success then redirect to login
      navigate('/login', { replace: true });
    } catch (err) {
      setError('Ошибка регистрации.');
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
          <label htmlFor="password">Пароль</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ height: 42, borderRadius: 8, border: '1px solid #ddd', padding: '0 12px' }} />
        </div>
        <button type="submit" style={{ height: 44, borderRadius: 10, border: '1px solid #000', background: '#000', color: '#fff', cursor: 'pointer' }}>Создать аккаунт</button>
      </form>
      <p style={{ marginTop: 12 }}>Уже есть аккаунт? <Link to="/login">Войти</Link></p>
    </section>
  );
}
