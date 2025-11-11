import React, { useState } from 'react';

export default function AdNew() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [condition, setCondition] = useState('new');
  const [description, setDescription] = useState('');

  const submit = (e) => {
    e.preventDefault();
    // Placeholder create action
    alert('Черновик создан (демо).');
  };

  return (
    <section data-easytag="id11-src/pages/AdNew.jsx" style={{ maxWidth: 760, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>Новое объявление</h1>
      <form onSubmit={submit} style={{ display: 'grid', gap: 12 }}>
        <div style={{ display: 'grid', gap: 6 }}>
          <label htmlFor="title">Заголовок</label>
          <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ height: 42, borderRadius: 8, border: '1px solid #ddd', padding: '0 12px' }} />
        </div>
        <div style={{ display: 'grid', gap: 6, gridTemplateColumns: '1fr 1fr', alignItems: 'center' }}>
          <div style={{ display: 'grid', gap: 6 }}>
            <label htmlFor="price">Цена</label>
            <input id="price" type="number" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} required style={{ height: 42, borderRadius: 8, border: '1px solid #ddd', padding: '0 12px' }} />
          </div>
          <div style={{ display: 'grid', gap: 6 }}>
            <label htmlFor="loc">Местоположение</label>
            <input id="loc" value={location} onChange={(e) => setLocation(e.target.value)} style={{ height: 42, borderRadius: 8, border: '1px solid #ddd', padding: '0 12px' }} />
          </div>
        </div>
        <div style={{ display: 'grid', gap: 6 }}>
          <label htmlFor="cond">Состояние товара</label>
          <select id="cond" value={condition} onChange={(e) => setCondition(e.target.value)} style={{ height: 42, borderRadius: 8, border: '1px solid #ddd', padding: '0 10px' }}>
            <option value="new">новый</option>
            <option value="used">б/у</option>
          </select>
        </div>
        <div style={{ display: 'grid', gap: 6 }}>
          <label htmlFor="descr">Описание</label>
          <textarea id="descr" rows={6} value={description} onChange={(e) => setDescription(e.target.value)} style={{ borderRadius: 8, border: '1px solid #ddd', padding: 12, resize: 'vertical' }} />
        </div>
        <button type="submit" style={{ height: 44, borderRadius: 10, border: '1px solid #000', background: '#000', color: '#fff', cursor: 'pointer' }}>Опубликовать</button>
      </form>
    </section>
  );
}
