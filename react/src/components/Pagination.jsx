import React from 'react';

function clamp(value, min, max) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

export default function Pagination({ page, pageSize, totalCount, onChangePage }) {
  const totalPages = Math.max(1, Math.ceil((totalCount || 0) / (pageSize || 1)));
  const current = clamp(page || 1, 1, totalPages);

  const goPrev = () => onChangePage(clamp(current - 1, 1, totalPages));
  const goNext = () => onChangePage(clamp(current + 1, 1, totalPages));

  return (
    <nav
      data-easytag="id4-src/components/Pagination.jsx"
      aria-label="Пагинация"
      style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center', padding: '16px 0' }}
    >
      <button
        type="button"
        onClick={goPrev}
        disabled={current <= 1}
        style={btnStyle}
      >
        Назад
      </button>
      <span style={{ fontSize: 14, color: '#555' }}>
        Стр. {current} из {totalPages}
      </span>
      <button
        type="button"
        onClick={goNext}
        disabled={current >= totalPages}
        style={btnStyle}
      >
        Вперёд
      </button>
    </nav>
  );
}

const btnStyle = {
  border: '1px solid #ddd',
  background: '#fff',
  color: '#111',
  padding: '8px 12px',
  borderRadius: 8,
  cursor: 'pointer',
  minWidth: 88,
};
