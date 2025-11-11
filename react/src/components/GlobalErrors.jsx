import React from 'react';
import { useErrors } from '../context/ErrorsContext.jsx';

function ListItems({ data }) {
  const keys = Object.keys(data || {});
  const items = [];
  for (let i = 0; i < keys.length; i += 1) {
    const k = keys[i];
    const v = data[k];
    if (Array.isArray(v)) {
      for (let j = 0; j < v.length; j += 1) {
        items.push(`${k}: ${v[j]}`);
      }
    }
  }
  return (
    <ul style={{ margin: '8px 0 0 16px', padding: 0 }}>
      {items.map((t, idx) => (
        <li key={idx} style={{ margin: '4px 0' }}>{t}</li>
      ))}
    </ul>
  );
}

export default function GlobalErrors() {
  const { errors, setErrors } = useErrors();
  if (!errors) return null;
  const status = errors.status;
  const data = errors.data || {};

  let message = '';
  if (typeof data.detail === 'string') message = data.detail;
  else if (Array.isArray(data.non_field_errors) && data.non_field_errors.length > 0) message = data.non_field_errors.join(', ');
  else message = 'Произошла ошибка при выполнении запроса.';

  return (
    <div data-easytag="id1-src/components/GlobalErrors.jsx" style={{
      border: '1px solid #e2e2e2',
      background: '#fff1f0',
      color: '#4a0000',
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      textAlign: 'left',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong>Ошибка{status ? ` ${status}` : ''}</strong>
        <button
          type="button"
          aria-label="Закрыть"
          onClick={() => setErrors(null)}
          style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 16 }}
        >✕</button>
      </div>
      <div style={{ marginTop: 8 }}>{message}</div>
      {typeof data === 'object' && !Array.isArray(data) && (
        <ListItems data={data} />
      )}
    </div>
  );
}
