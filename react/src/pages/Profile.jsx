import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMe, updateMe } from '../api/members.js';
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

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({ nonField: [], fields: {} });
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', avatar_url: '' });

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await getMe();
        if (!mounted) return;
        const me = res.data || {};
        setForm({ name: me.name || '', phone: me.phone || '', avatar_url: me.avatar_url || '' });
      } catch (err) {
        const parsed = extractAxiosErrors(err);
        setErrors({ nonField: parsed.nonField, fields: parsed.fields });
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  function updateField(key, value) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  async function onSave(e) {
    e.preventDefault();
    setSaving(true);
    setErrors({ nonField: [], fields: {} });
    setSuccess('');
    try {
      const res = await updateMe({ name: form.name, phone: form.phone, avatar_url: form.avatar_url });
      const data = res.data || {};
      setForm({ name: data.name || '', phone: data.phone || '', avatar_url: data.avatar_url || '' });
      setSuccess('Профиль сохранён');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const parsed = extractAxiosErrors(err);
      setErrors({ nonField: parsed.nonField, fields: parsed.fields });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div data-easytag="id12-src/pages/Profile.jsx" style={{ maxWidth: 720, margin: '0 auto' }}>
        <div style={{ color: '#666' }}>Загрузка…</div>
      </div>
    );
  }

  return (
    <div data-easytag="id12-src/pages/Profile.jsx" style={{ maxWidth: 720, margin: '0 auto' }}>
      <h1 style={{ margin: '8px 0 8px', fontWeight: 600 }}>Профиль</h1>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 12, margin: '6px 0 18px' }}>
        <Link to="/my" style={{ padding: '8px 12px', borderRadius: 999, border: '1px solid #e5e5e5', color: '#111', textDecoration: 'none' }}>Мои объявления</Link>
        <Link to="/favorites" style={{ padding: '8px 12px', borderRadius: 999, border: '1px solid #e5e5e5', color: '#111', textDecoration: 'none' }}>Избранное</Link>
      </div>

      {errors.nonField.length > 0 && (
        <div style={{ background: '#fff1f1', border: '1px solid #ffd0d0', padding: 12, borderRadius: 8, color: '#a70000', marginBottom: 12 }}>
          {errors.nonField.map((m, i) => (
            <div key={i}>{m}</div>
          ))}
        </div>
      )}

      {success && (
        <div style={{ background: '#eef9f0', border: '1px solid #c6efd1', padding: 12, borderRadius: 8, color: '#146c2e', marginBottom: 12 }}>
          {success}
        </div>
      )}

      <form onSubmit={onSave} noValidate>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <label style={{ display: 'block' }}>
            <div style={{ fontSize: 14, marginBottom: 6 }}>Имя</div>
            <input
              type="text"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="Ваше имя"
              required
              style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #d0d0d0' }}
            />
            <FieldError messages={errors.fields.name} />
          </label>

          <label style={{ display: 'block' }}>
            <div style={{ fontSize: 14, marginBottom: 6 }}>Телефон</div>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              placeholder="+7 900 000-00-00"
              required
              style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #d0d0d0' }}
            />
            <FieldError messages={errors.fields.phone} />
          </label>
        </div>

        <label style={{ display: 'block', marginTop: 16 }}>
          <div style={{ fontSize: 14, marginBottom: 6 }}>URL аватара</div>
          <input
            type="url"
            value={form.avatar_url}
            onChange={(e) => updateField('avatar_url', e.target.value)}
            placeholder="https://example.com/avatar.png"
            style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #d0d0d0' }}
          />
          <FieldError messages={errors.fields.avatar_url} />
        </label>

        {form.avatar_url ? (
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 14, color: '#666', marginBottom: 6 }}>Предпросмотр</div>
            <div style={{ border: '1px solid #e5e5e5', borderRadius: 12, padding: 12, display: 'inline-block' }}>
              {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
              <img src={form.avatar_url} alt="Avatar preview" style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 12 }} />
            </div>
          </div>
        ) : null}

        <div style={{ marginTop: 20 }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: '12px 18px',
              borderRadius: 12,
              border: 'none',
              background: '#111',
              color: '#fff',
              fontWeight: 600,
              cursor: saving ? 'not-allowed' : 'pointer',
            }}
          >
            {saving ? 'Сохраняем…' : 'Сохранить'}
          </button>
        </div>
      </form>
    </div>
  );
}
