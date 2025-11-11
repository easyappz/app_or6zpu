import React from 'react';
import { useParams } from 'react-router-dom';

export default function AdView() {
  const { id } = useParams();

  return (
    <section data-easytag="id13-src/pages/AdView.jsx" style={{ maxWidth: 920, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }}>
        <div>
          <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: 12, background: '#eee', marginBottom: 16 }} aria-label="placeholder" />
          <h1 style={{ fontSize: 28, marginBottom: 8 }}>Объявление #{id}</h1>
          <p style={{ color: '#555' }}>Описание товара. Текст-заглушка.</p>
        </div>
        <aside style={{ border: '1px solid #eee', borderRadius: 12, padding: 16, height: 'fit-content' }}>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>50 000 ₽</div>
          <div style={{ display: 'grid', gap: 6, marginBottom: 12 }}>
            <div><strong>Местоположение:</strong> Москва</div>
            <div><strong>Состояние:</strong> б/у</div>
            <div><strong>Контакты:</strong> user@example.com, +7 900 000-00-00</div>
          </div>
          <button type="button" style={{ width: '100%', height: 44, borderRadius: 10, border: '1px solid #000', background: '#000', color: '#fff', cursor: 'pointer' }}>Связаться</button>
        </aside>
      </div>
    </section>
  );
}
