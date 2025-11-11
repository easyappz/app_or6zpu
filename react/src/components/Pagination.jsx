import React from 'react';

export default function Pagination({ page = 1, totalPages = 1, onChange }) {
  const prev = () => onChange && onChange(Math.max(1, page - 1));
  const next = () => onChange && onChange(Math.min(totalPages, page + 1));

  return (
    <nav data-easytag="id6-src/components/Pagination.jsx" aria-label="Pagination" style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center', marginTop: 16 }}>
      <button type="button" onClick={prev} disabled={page <= 1} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd', background: '#fff', cursor: page <= 1 ? 'not-allowed' : 'pointer' }}>Назад</button>
      <span style={{ color: '#333' }}>{page} / {totalPages}</span>
      <button type="button" onClick={next} disabled={page >= totalPages} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd', background: '#fff', cursor: page >= totalPages ? 'not-allowed' : 'pointer' }}>Вперёд</button>
    </nav>
  );
}
