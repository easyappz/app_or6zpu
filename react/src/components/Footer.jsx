import React from 'react';

export default function Footer() {
  return (
    <footer data-easytag="id2-src/components/Footer.jsx" style={{
      width: '100%',
      borderTop: '1px solid #eee',
      background: '#fff',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px' }}>
        <p style={{ margin: 0, color: '#666', fontSize: 13 }}>© {new Date().getFullYear()} Доска объявлений</p>
      </div>
    </footer>
  );
}
