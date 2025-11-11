import React, { useState } from 'react';
import FiltersBar from '../components/FiltersBar.jsx';
import AdCard from '../components/AdCard.jsx';
import Pagination from '../components/Pagination.jsx';

export default function Landing() {
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);

  // Placeholder list for now
  const items = Array.from({ length: 8 }).map((_, i) => ({
    id: i + 1 + (page - 1) * 8,
    title: `Объявление #${i + 1 + (page - 1) * 8}`,
    price: (i + 1) * 1000,
    location: 'Москва',
    condition: 'б/у',
  }));

  return (
    <section data-easytag="id7-src/pages/Landing.jsx">
      <h1 style={{ fontSize: 28, margin: '0 0 16px 0' }}>Объявления</h1>
      <FiltersBar onApply={(f) => { setPage(1); setFilters(f); }} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
        {items.map((ad) => (
          <AdCard key={ad.id} {...ad} />
        ))}
      </div>

      <Pagination page={page} totalPages={5} onChange={setPage} />

      {filters && Object.keys(filters).length > 0 ? (
        <p style={{ marginTop: 12, color: '#777' }}>Применены фильтры: {JSON.stringify(filters)}</p>
      ) : null}
    </section>
  );
}
