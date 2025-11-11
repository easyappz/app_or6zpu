import React from 'react';
import { Link } from 'react-router-dom';

export default function AdCard({ id, title, price, location, condition }) {
  return (
    <article data-easytag="id4-src/components/AdCard.jsx" style={{
      border: '1px solid #eee',
      borderRadius: 12,
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      background: '#fff',
    }}>
      <div style={{
        width: '100%',
        aspectRatio: '16/9',
        borderRadius: 8,
        background: 'linear-gradient(180deg,#f7f7f7,#efefef)',
      }} aria-label="placeholder" />

      <Link to={`/ads/${id}`} style={{ color: '#000', textDecoration: 'none', fontWeight: 600, fontSize: 16 }}>
        {title}
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#333' }}>
        <span style={{ fontWeight: 700 }}>{price != null ? `${price} ₽` : '—'}</span>
        <span aria-hidden>·</span>
        <span>{location || 'Местоположение не указано'}</span>
        {condition ? <><span aria-hidden>·</span><span>{condition}</span></> : null}
      </div>
    </article>
  );
}
