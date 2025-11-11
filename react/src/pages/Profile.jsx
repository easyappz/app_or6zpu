import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Profile() {
  const { member } = useAuth();

  const name = member?.name || '—';
  const email = member?.email || '—';
  const phone = member?.phone || '—';
  const avatarUrl = member?.avatar_url || '';

  return (
    <section data-easytag="id10-src/pages/Profile.jsx" style={{ maxWidth: 720, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>Профиль</h1>
      <div style={{ display: 'grid', gap: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 12, alignItems: 'center' }}>
          {avatarUrl ? (
            <img src={avatarUrl} alt="avatar" style={{ width: 120, height: 120, borderRadius: 16, objectFit: 'cover', background: '#f0f0f0' }} />
          ) : (
            <div style={{ width: 120, height: 120, borderRadius: 16, background: '#f0f0f0' }} aria-label="avatar" />
          )}
          <div>
            <p style={{ margin: 0 }}><strong>Имя:</strong> {name}</p>
            <p style={{ margin: 0 }}><strong>Email:</strong> {email}</p>
            <p style={{ margin: 0 }}><strong>Телефон:</strong> {phone}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
