import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchCategories } from '../api/categories.js';
import { createAd } from '../api/ads.js';

const CONDITIONS = [
  { value: 'new', label: 'Новый' },
  { value: 'like_new', label: 'Как новый' },
  { value: 'used', label: 'Б/У' },
  { value: 'for_parts', label: 'На запчасти' },
];

function AdNew() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    photos: [''],
    location: '',
    contact: '',
    condition: '',
    category_id: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    let mounted = true;
    setLoadingCats(true);
    fetchCategories()
      .then((data) => {
        if (!mounted) return;
        setCategories(Array.isArray(data) ? data : []);
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => mounted && setLoadingCats(false));
    return () => {
      mounted = false;
    };
  }, []);

  const categoryOptions = useMemo(() => {
    return categories.map((c) => ({ value: c.id, label: c.name }));
  }, [categories]);

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function updatePhoto(index, value) {
    setForm((prev) => {
      const next = [...prev.photos];
      next[index] = value;
      return { ...prev, photos: next };
    });
  }

  function addPhotoField() {
    setForm((prev) => ({ ...prev, photos: [...(prev.photos || []), ''] }));
  }

  function removePhotoField(index) {
    setForm((prev) => {
      const next = [...(prev.photos || [])];
      next.splice(index, 1);
      return { ...prev, photos: next };
    });
  }

  function validate(values) {
    const e = {};
    if (!values.title || values.title.trim() === '') e.title = 'Обязательное поле';
    if (!values.description || values.description.trim() === '') e.description = 'Обязательное поле';
    if (!values.price || values.price.toString().trim() === '') {
      e.price = 'Обязательное поле';
    } else {
      const num = Number(values.price);
      if (!(Number.isFinite(num) && num > 0)) e.price = 'Цена должна быть положительным числом';
    }
    if (!values.location || values.location.trim() === '') e.location = 'Обязательное поле';
    if (!values.contact || values.contact.trim() === '') e.contact = 'Обязательное поле';
    if (!values.condition) e.condition = 'Выберите состояние';
    if (!values.category_id) e.category_id = 'Выберите категорию';
    return e;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setServerError('');
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      price: String(form.price).trim(),
      photos: (form.photos || []).filter((p) => p && p.trim() !== ''),
      location: form.location.trim(),
      contact: form.contact.trim(),
      condition: form.condition,
      category_id: Number(form.category_id),
    };

    const v = validate(payload);
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    try {
      setSubmitting(true);
      const created = await createAd(payload);
      if (created && created.id) {
        navigate(`/ads/${created.id}`);
      } else {
        setServerError('Неожиданный ответ сервера');
      }
    } catch (err) {
      // Map validation errors if present
      const data = err?.response?.data;
      if (data && typeof data === 'object') {
        setErrors((prev) => ({ ...prev, ...data }));
        if (data.detail && typeof data.detail === 'string') setServerError(data.detail);
      } else {
        setServerError('Ошибка при создании объявления');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div data-easytag="id1-src/pages/AdNew.jsx" style={{ maxWidth: 780, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 16 }}>Новое объявление</h1>
      {serverError && (
        <div style={{ background: '#fff1f0', border: '1px solid #ffa39e', color: '#a8071a', padding: '12px 16px', borderRadius: 8, marginBottom: 16 }}>
          {serverError}
        </div>
      )}
      <form data-easytag="id1-form-src/pages/AdNew.jsx" onSubmit={onSubmit} style={{ display: 'grid', gap: 16 }}>
        <div>
          <label htmlFor="title" style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>Заголовок</label>
          <input id="title" type="text" value={form.title} onChange={(ev) => updateField('title', ev.target.value)} placeholder="Например: iPhone 13, 128 ГБ" style={inputStyle} />
          {errors.title && <FieldError text={errors.title} />}
        </div>

        <div>
          <label htmlFor="description" style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>Описание</label>
          <textarea id="description" value={form.description} onChange={(ev) => updateField('description', ev.target.value)} placeholder="Подробно опишите товар" rows={6} style={{ ...inputStyle, resize: 'vertical' }} />
          {errors.description && <FieldError text={errors.description} />}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label htmlFor="price" style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>Цена</label>
            <input id="price" type="number" step="0.01" min="0" value={form.price} onChange={(ev) => updateField('price', ev.target.value)} placeholder="0.00" style={inputStyle} />
            {errors.price && <FieldError text={errors.price} />}
          </div>
          <div>
            <label htmlFor="category" style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>Категория</label>
            <select id="category" value={form.category_id} onChange={(ev) => updateField('category_id', ev.target.value)} disabled={loadingCats} style={inputStyle}>
              <option value="">Выберите категорию</option>
              {categoryOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {errors.category_id && <FieldError text={errors.category_id} />}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label htmlFor="location" style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>Местоположение</label>
            <input id="location" type="text" value={form.location} onChange={(ev) => updateField('location', ev.target.value)} placeholder="Город, район" style={inputStyle} />
            {errors.location && <FieldError text={errors.location} />}
          </div>
          <div>
            <label htmlFor="contact" style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>Контактные данные</label>
            <input id="contact" type="text" value={form.contact} onChange={(ev) => updateField('contact', ev.target.value)} placeholder="Телефон или email" style={inputStyle} />
            {errors.contact && <FieldError text={errors.contact} />}
          </div>
        </div>

        <div>
          <label htmlFor="condition" style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>Состояние товара</label>
          <select id="condition" value={form.condition} onChange={(ev) => updateField('condition', ev.target.value)} style={inputStyle}>
            <option value="">Выберите состояние</option>
            {CONDITIONS.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          {errors.condition && <FieldError text={errors.condition} />}
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>Фотографии (URL)</label>
            <button type="button" onClick={addPhotoField} style={ghostButtonStyle}>Добавить</button>
          </div>
          <div style={{ display: 'grid', gap: 8 }}>
            {(form.photos || []).map((url, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8 }}>
                <input type="url" placeholder="https://example.com/photo.jpg" value={url} onChange={(ev) => updatePhoto(idx, ev.target.value)} style={inputStyle} />
                <button type="button" onClick={() => removePhotoField(idx)} style={dangerButtonStyle} disabled={(form.photos || []).length === 0}>Удалить</button>
              </div>
            ))}
          </div>
          {errors.photos && <FieldError text={errors.photos} />}
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <button type="submit" disabled={submitting} style={primaryButtonStyle}>{submitting ? 'Сохранение…' : 'Создать объявление'}</button>
          <Link to="/" style={linkButtonStyle}>Отмена</Link>
        </div>
      </form>
    </div>
  );
}

function FieldError({ text }) {
  return (
    <div style={{ color: '#a8071a', fontSize: 13, marginTop: 6 }}>{Array.isArray(text) ? text.join(', ') : String(text)}</div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: 10,
  border: '1px solid #d9d9d9',
  outline: 'none',
  background: '#fff',
  fontSize: 14,
};

const primaryButtonStyle = {
  padding: '12px 18px',
  borderRadius: 12,
  border: '1px solid #111',
  background: '#111',
  color: '#fff',
  fontWeight: 600,
  cursor: 'pointer',
};

const linkButtonStyle = {
  padding: '12px 18px',
  borderRadius: 12,
  border: '1px solid #d9d9d9',
  background: '#fff',
  color: '#111',
  fontWeight: 600,
  textDecoration: 'none',
};

const ghostButtonStyle = {
  padding: '8px 12px',
  borderRadius: 10,
  border: '1px solid #d9d9d9',
  background: '#fafafa',
  cursor: 'pointer',
};

const dangerButtonStyle = {
  padding: '8px 12px',
  borderRadius: 10,
  border: '1px solid #ffccc7',
  background: '#fff1f0',
  color: '#a8071a',
  cursor: 'pointer',
};

export default AdNew;
