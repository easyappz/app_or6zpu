import React, { useState } from 'react';

export default function FiltersBar({ onApply }) {
  const [category, setCategory] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [place, setPlace] = useState('');
  const [q, setQ] = useState('');

  const apply = (e) => {
    e.preventDefault();
    if (typeof onApply === 'function') {
      onApply({ category, priceMin, priceMax, dateFrom, place, q });
    }
  };

  const reset = () => {
    setCategory('');
    setPriceMin('');
    setPriceMax('');
    setDateFrom('');
    setPlace('');
    setQ('');
    if (typeof onApply === 'function') onApply({});
  };

  return (
    <form data-easytag="id5-src/components/FiltersBar.jsx" onSubmit={apply} style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 160px',
      gap: 12,
      alignItems: 'end',
      marginBottom: 16,
    }}>
      <div style={{ display: 'grid', gap: 6 }}>
        <label htmlFor="f-cat" style={{ color: '#555', fontSize: 12 }}>Категория</label>
        <select id="f-cat" value={category} onChange={(e) => setCategory(e.target.value)} style={{ height: 38, borderRadius: 8, border: '1px solid #ddd', padding: '0 10px' }}>
          <option value="">Все</option>
          <option value="electronics">Электроника</option>
          <option value="realty">Недвижимость</option>
          <option value="auto">Авто</option>
          <option value="services">Услуги</option>
          <option value="jobs">Работа</option>
          <option value="others">Прочее</option>
        </select>
      </div>

      <div style={{ display: 'grid', gap: 6 }}>
        <label htmlFor="f-min" style={{ color: '#555', fontSize: 12 }}>Цена от</label>
        <input id="f-min" type="number" inputMode="numeric" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} placeholder="0" style={{ height: 38, borderRadius: 8, border: '1px solid #ddd', padding: '0 10px' }} />
      </div>

      <div style={{ display: 'grid', gap: 6 }}>
        <label htmlFor="f-max" style={{ color: '#555', fontSize: 12 }}>Цена до</label>
        <input id="f-max" type="number" inputMode="numeric" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} placeholder="100000" style={{ height: 38, borderRadius: 8, border: '1px solid #ddd', padding: '0 10px' }} />
      </div>

      <div style={{ display: 'grid', gap: 6 }}>
        <label htmlFor="f-date" style={{ color: '#555', fontSize: 12 }}>Дата с</label>
        <input id="f-date" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} style={{ height: 38, borderRadius: 8, border: '1px solid #ddd', padding: '0 10px' }} />
      </div>

      <div style={{ display: 'grid', gap: 6 }}>
        <label htmlFor="f-place" style={{ color: '#555', fontSize: 12 }}>Местоположение</label>
        <input id="f-place" type="text" value={place} onChange={(e) => setPlace(e.target.value)} placeholder="Город/Регион" style={{ height: 38, borderRadius: 8, border: '1px solid #ddd', padding: '0 10px' }} />
      </div>

      <div style={{ display: 'grid', gap: 6, gridColumn: '1 / -1' }}>
        <label htmlFor="f-q" style={{ color: '#555', fontSize: 12 }}>Поиск по ключевым словам</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px 120px', gap: 12 }}>
          <input id="f-q" type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Что ищем?" style={{ height: 42, borderRadius: 8, border: '1px solid #ddd', padding: '0 12px' }} />
          <button type="submit" style={{ height: 42, borderRadius: 8, border: '1px solid #000', background: '#000', color: '#fff', cursor: 'pointer' }}>Найти</button>
          <button type="button" onClick={reset} style={{ height: 42, borderRadius: 8, border: '1px solid #ddd', background: '#fafafa', cursor: 'pointer' }}>Сбросить</button>
        </div>
      </div>
    </form>
  );
}
