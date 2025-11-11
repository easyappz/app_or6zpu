import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { loginUser } from '../api/auth.js';
import { extractAxiosErrors } from '../api/errors.js';

function FieldError({ messages }) {
  if (!messages || messages.length === 0) return null;
  return (
    <div style={{ color: '#c00', fontSize: 12, marginTop: 6 }}>
      {messages.map((m, i) => (
        <div key={i}>{m}</div>
      ))}
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({ nonField: [], fields: {} });

  const registerSuccess = useMemo(() => location?.state?.registered === true, [location?.state]);

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({ nonField: [], fields: {} });
    try {
      const res = await loginUser({ email, password });
      const { access, expires_in } = res.data || {};
      if (access) {
        localStorage.setItem('token', access);
        if (typeof expires_in === 'number') {
          localStorage.setItem('token_expires_at', String(Date.now() + expires_in * 1000));
        }
        try {
          window.dispatchEvent(new CustomEvent('auth:changed'));
        } catch (_) {}
        navigate('/profile', { replace: true });
      } else {
        setErrors({ nonField: ['Не удалось получить токен доступа'], fields: {} });
      }
    } catch (err) {
      const parsed = extractAxiosErrors(err);
      setErrors({ nonField: parsed.nonField, fields: parsed.fields });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div data-easytag="id10-src/pages/Login.jsx" style={{ maxWidth: 420, margin: '0 auto' }}>
      <h1 style={{ margin: '8px 0 16px', fontWeight: 600 }}>Вход</h1>

      {registerSuccess && (
        <div style={{ background: '#eef9f0', border: '1px solid #c6efd1', padding: 12, borderRadius: 8, color: '#146c2e', marginBottom: 12 }}>
          Регистрация успешна. Теперь войдите в аккаунт.
        </div>
      )}

      {errors.nonField.length > 0 && (
        <div style={{ background: '#fff1f1', border: '1px solid #ffd0d0', padding: 12, borderRadius: 8, color: '#a70000', marginBottom: 12 }}>
          {errors.nonField.map((m, i) => (
            <div key={i}>{m}</div>
          ))}
        </div>
      )}

      <form onSubmit={onSubmit} noValidate>
        <label style={{ display: 'block', marginBottom: 12 }}>
          <div style={{ fontSize: 14, marginBottom: 6 }}>Email</div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
            style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #d0d0d0' }}
          />
          <FieldError messages={errors.fields.email} />
        </label>

        <label style={{ display: 'block', marginBottom: 16 }}>
          <div style={{ fontSize: 14, marginBottom: 6 }}>Пароль</div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••"
            autoComplete="current-password"
            required
            style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #d0d0d0' }}
          />
          <FieldError messages={errors.fields.password} />
        </label>

        <button
          type="submit"
          disabled={submitting}
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: 12,
            border: 'none',
            background: '#111',
            color: '#fff',
            fontWeight: 600,
            cursor: submitting ? 'not-allowed' : 'pointer',
          }}
        >
          {submitting ? 'Входим…' : 'Войти'}
        </button>
      </form>

      <div style={{ marginTop: 16, textAlign: 'center', fontSize: 14 }}>
        Нет аккаунта?{' '}
        <Link to="/register" style={{ color: '#0070f3', textDecoration: 'none' }}>Зарегистрироваться</Link>
      </div>
    </div>
  );
}
