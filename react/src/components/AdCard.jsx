import React from 'react';

export default function AdCard({ ad, onToggleFavorite, isAuth }) {
  const handleFav = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavorite) onToggleFavorite(ad);
  };

  return (
    <article
      data-easytag="id3-src/components/AdCard.jsx"
      style={cardStyle}
      aria-label={ad?.title || 'Объявление'}
    >
      <div style={imageBox} aria-hidden="true" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <h3 data-easytag="id3.1-src/components/AdCard.jsx" title={ad?.title} style={titleStyle}>
          {ad?.title}
        </h3>
        <div data-easytag="id3.2-src/components/AdCard.jsx" style={metaRow}>
          <span style={priceStyle}>{ad?.price} ₽</span>
          <span style={locationStyle}>{ad?.location}</span>
        </div>
      </div>
      <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end' }}>
        <button
          data-easytag="id3.3-src/components/AdCard.jsx"
          type="button"
          aria-label={ad?.is_favorite ? 'Убрать из избранного' : 'Добавить в избранное'}
          onClick={handleFav}
          disabled={!isAuth}
          style={{
            ...favBtn,
            color: ad?.is_favorite ? '#e02424' : '#555',
            borderColor: ad?.is_favorite ? '#e02424' : '#ddd',
            opacity: isAuth ? 1 : 0.5,
          }}
          title={isAuth ? '' : 'Только для авторизованных'}
        >
          ♥
        </button>
      </div>
    </article>
  );
}

const cardStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  border: '1px solid #eee',
  borderRadius: 12,
  padding: 12,
  background: '#fff',
  boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
};

const imageBox = {
  height: 150,
  borderRadius: 10,
  background: 'linear-gradient(180deg,#fafafa,#f1f1f1)',
  border: '1px solid #eee'
};

const titleStyle = {
  fontSize: 16,
  fontWeight: 600,
  color: '#111',
  lineHeight: 1.3,
  margin: 0,
};

const metaRow = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8
};

const priceStyle = { fontSize: 15, fontWeight: 600 };
const locationStyle = { fontSize: 13, color: '#666' };

const favBtn = {
  border: '1px solid #ddd',
  borderRadius: 8,
  background: '#fff',
  padding: '6px 10px',
  cursor: 'pointer',
};
