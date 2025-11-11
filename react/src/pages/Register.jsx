import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../api/auth.js';
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

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({ nonField: [], fields: {} });

  function updateField(key, value) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({ nonField: [], fields: {} });
    try {
      await registerUser({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      navigate('/login', { replace: true, state: { registered: true } });
    } catch (err) {
      const parsed = extractAxiosErrors(err);
      setErrors({ nonField: parsed.nonField, fields: parsed.fields });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div data-easytag="id11-src/pages/Register.jsx" style={{ maxWidth: 520, margin: '0 auto' }}>
      <h1 style={{ margin: '8px 0 16px', fontWeight: 600 }}>Регистрация</h1>

      {errors.nonField.length > 0 && (
        <div style={{ background: '#fff1f1', border: '1px solid #ffd0d0', padding: 12, borderRadius: 8, color: '#a70000', marginBottom: 12 }}>
          {errors.nonField.map((m, i) => (
            <div key={i}>{m}</div>
          ))}
        </div>
      )}

      <form onSubmit={onSubmit} noValidate>
        <label style={{ display: 'block', marginBottom: 12 }}>
          <div style={{ fontSize: 14, marginBottom: 6 }}>Имя</div>
          <input
            type="text"
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="Иван"
            required
            style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #d0d0d0' }}
          />
          <FieldError messages={errors.fields.name} />
        </label>

        <label style={{ display: 'block', marginBottom: 12 }}>
          <div style={{ fontSize: 14, marginBottom: 6 }}>Email</div>
          <input
            type="email"
            value={form.email}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
            style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #d0d0d0' }}
          />
          <FieldError messages={errors.fields.email} />
        </label>

        <label style={{ display: 'block', marginBottom: 12 }}>
          <div style={{ fontSize: 14, marginBottom: 6 }}>Телефон</div>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            placeholder="+7 900 000-00-00"
            autoComplete="tel"
            required
            style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #d0d0d0' }}
          />
          <FieldError messages={errors.fields.phone} />
        </label>

        <label style={{ display: 'block', marginBottom: 16 }}>
          <div style={{ fontSize: 14, marginBottom: 6 }}>Пароль</div>
          <input
            type="password"
            value={form.password}
            onChange={(e) => updateField('password', e.target.value)}
            placeholder="Минимум 6 символов"
            autoComplete="new-password"
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
          {submitting ? 'Регистрируем…' : 'Зарегистрироваться'}
        </button>
      </form>

      <div style={{ marginTop: 16, textAlign: 'center', fontSize: 14 }}>
        Уже есть аккаунт?{' '}
        <Link to="/login" style={{ color: '#0070f3', textDecoration: 'none' }}>Войти</Link>
      </div>
    </div>
  );
}
