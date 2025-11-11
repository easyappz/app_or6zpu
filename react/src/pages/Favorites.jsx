import React from 'react';
import AdCard from '../components/AdCard.jsx';

export default function Favorites() {
  const items = Array.from({ length: 4 }).map((_, i) => ({
    id: i + 1,
    title: `Избранное #${i + 1}`,
    price: (i + 1) * 5000,
    location: 'Санкт-Петербург',
    condition: 'новый',
  }));

  return (
    <section data-easytag="id14-src/pages/Favorites.jsx">
      <h1 style={{ fontSize: 28, margin: '0 0 16px 0' }}>Избранное</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
        {items.map((ad) => (
          <AdCard key={ad.id} {...ad} />
        ))}
      </div>
    </section>
  );
}
