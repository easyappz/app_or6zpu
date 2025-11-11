import React from 'react';
import { Link } from 'react-router-dom';
import AdCard from '../components/AdCard.jsx';

export default function MyAds() {
  const items = Array.from({ length: 5 }).map((_, i) => ({
    id: i + 10,
    title: `Моё объявление #${i + 1}`,
    price: (i + 1) * 8000,
    location: 'Казань',
    condition: 'б/у',
  }));

  return (
    <section data-easytag="id15-src/pages/MyAds.jsx">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1 style={{ fontSize: 28, margin: 0 }}>Мои объявления</h1>
        <Link to="/ads/new" style={{ height: 40, display: 'inline-flex', alignItems: 'center', padding: '0 14px', borderRadius: 10, border: '1px solid #000', background: '#000', color: '#fff', textDecoration: 'none' }}>Добавить</Link>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
        {items.map((ad) => (
          <AdCard key={ad.id} {...ad} />
        ))}
      </div>
    </section>
  );
}
