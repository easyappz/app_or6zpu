import React from 'react';

export default function Profile() {
  return (
    <section data-easytag="id10-src/pages/Profile.jsx" style={{ maxWidth: 720, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>Профиль</h1>
      <div style={{ display: 'grid', gap: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 12, alignItems: 'center' }}>
          <div style={{ width: 120, height: 120, borderRadius: 16, background: '#f0f0f0' }} aria-label="avatar" />
          <div>
            <p style={{ margin: 0 }}><strong>Имя:</strong> Имя пользователя</p>
            <p style={{ margin: 0 }}><strong>Email:</strong> user@example.com</p>
            <p style={{ margin: 0 }}><strong>Телефон:</strong> +7 900 000-00-00</p>
          </div>
        </div>
      </div>
    </section>
  );
}
