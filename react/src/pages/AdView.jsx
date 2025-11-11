import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getAdById, addFavorite, removeFavorite, deleteAd as apiDeleteAd } from '../api/ads';

const CONDITION_MAP = {
  new: 'Новый',
  like_new: 'Как новый',
  used: 'Б/У',
  for_parts: 'На запчасти',
};

export default function AdView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, member } = useAuth();

  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [favLoading, setFavLoading] = useState(false);
  const [delLoading, setDelLoading] = useState(false);

  const owner = useMemo(() => {
    if (!ad || !member) return false;
    return Number(member?.id) === Number(ad?.owner_id);
  }, [ad, member]);

  const sellerName = useMemo(() => {
    if (owner) return member?.name || 'Мой профиль';
    if (ad?.owner_id != null) return `Пользователь #${ad.owner_id}`;
    return 'Неизвестно';
  }, [owner, member, ad]);

  const localizedCondition = useMemo(() => {
    const key = ad?.condition;
    return key ? (CONDITION_MAP[key] || key) : '—';
  }, [ad]);

  const loadAd = useCallback(async () => {
    setLoading(true);
    setError('');
    setNotFound(false);
    try {
      const { data } = await getAdById(id);
      setAd(data);
    } catch (e) {
      if (e?.response?.status === 404) {
        setNotFound(true);
      } else {
        const detail = e?.response?.data?.detail || 'Не удалось загрузить объявление';
        setError(detail);
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadAd();
  }, [loadAd]);

  const handleToggleFavorite = useCallback(async () => {
    if (!token || !ad) return;
    setActionError('');
    setFavLoading(true);
    try {
      if (ad.is_favorite) {
        await removeFavorite(ad.id);
        setAd((prev) => (prev ? { ...prev, is_favorite: false } : prev));
      } else {
        await addFavorite(ad.id);
        setAd((prev) => (prev ? { ...prev, is_favorite: true } : prev));
      }
    } catch (e) {
      const detail = e?.response?.data?.detail || 'Не удалось изменить избранное';
      setActionError(detail);
    } finally {
      setFavLoading(false);
    }
  }, [token, ad]);

  const handleDelete = useCallback(async () => {
    if (!owner || !ad) return;
    const ok = window.confirm('Удалить это объявление без возможности восстановления?');
    if (!ok) return;
    setActionError('');
    setDelLoading(true);
    try {
      await apiDeleteAd(ad.id);
      navigate('/my', { replace: true });
    } catch (e) {
      const detail = e?.response?.data?.detail || 'Не удалось удалить объявление';
      setActionError(detail);
    } finally {
      setDelLoading(false);
    }
  }, [owner, ad, navigate]);

  if (loading) {
    return (
      <section data-easytag="id13-src/pages/AdView.jsx" style={{ maxWidth: 920, margin: '0 auto' }}>
        <div style={{ padding: 24 }}>Загрузка…</div>
      </section>
    );
  }

  if (notFound) {
    return (
      <section data-easytag="id13-src/pages/AdView.jsx" style={{ maxWidth: 920, margin: '0 auto' }}>
        <div style={{ padding: 32, border: '1px solid #eee', borderRadius: 12 }}>
          <h1 style={{ fontSize: 22, margin: 0, marginBottom: 8 }}>Объявление не найдено (404)</h1>
          <p style={{ margin: 0, marginBottom: 12, color: '#555' }}>Возможно, оно было удалено или никогда не существовало.</p>
          <Link to="/" style={{ color: '#0071e3', textDecoration: 'none' }}>Вернуться на главную</Link>
        </div>
      </section>
    );
  }

  if (!ad) {
    return (
      <section data-easytag="id13-src/pages/AdView.jsx" style={{ maxWidth: 920, margin: '0 auto' }}>
        <div style={{ padding: 24, color: '#b00020' }}>{error || 'Неизвестная ошибка'}</div>
      </section>
    );
  }

  const photos = Array.isArray(ad.photos) ? ad.photos : [];
  const thumbCount = photos.length > 0 ? photos.length : 4; // placeholders when no photos

  return (
    <section data-easytag="id13-src/pages/AdView.jsx" style={{ maxWidth: 920, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }}>
        <div>
          <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: 12, background: '#f2f2f2', marginBottom: 16, border: '1px solid #e5e5e5' }} aria-label="photos-main-placeholder" />

          {thumbCount > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
              {Array.from({ length: thumbCount }).map((_, idx) => (
                <div
                  key={idx}
                  aria-label={`photo-placeholder-${idx + 1}`}
                  style={{ width: '100%', aspectRatio: '1/1', borderRadius: 10, background: '#fafafa', border: '1px solid #eee' }}
                />
              ))}
            </div>
          )}

          <h1 style={{ fontSize: 28, marginBottom: 8 }}>{ad.title}</h1>
          <p style={{ color: '#555', whiteSpace: 'pre-wrap' }}>{ad.description}</p>
        </div>

        <aside style={{ border: '1px solid #eee', borderRadius: 12, padding: 16, height: 'fit-content', position: 'sticky', top: 16 }}>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>{Number(ad.price).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}</div>

          <div style={{ display: 'grid', gap: 6, marginBottom: 12 }}>
            <div><strong>Местоположение:</strong> {ad.location || '—'}</div>
            <div><strong>Состояние:</strong> {localizedCondition}</div>
            <div><strong>Продавец:</strong> {sellerName}</div>
            <div><strong>Контакты:</strong> {ad.contact || '—'}</div>
          </div>

          {token && (
            <button
              type="button"
              onClick={handleToggleFavorite}
              disabled={favLoading}
              style={{ width: '100%', height: 44, borderRadius: 10, border: '1px solid #1d1d1f', background: ad.is_favorite ? '#1d1d1f' : '#fff', color: ad.is_favorite ? '#fff' : '#1d1d1f', cursor: 'pointer', marginBottom: 8 }}
              aria-label="favorite-toggle"
              data-easytag="id13fav-src/pages/AdView.jsx"
            >
              {ad.is_favorite ? 'Убрать из избранного' : 'В избранное'}
            </button>
          )}

          {owner && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
              <Link to={`./edit`} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: 44, borderRadius: 10, border: '1px solid #1d1d1f', color: '#1d1d1f', textDecoration: 'none' }} aria-label="edit-ad">Редактировать</Link>
              <button type="button" onClick={handleDelete} disabled={delLoading} style={{ height: 44, borderRadius: 10, border: '1px solid #b00020', background: '#b00020', color: '#fff', cursor: 'pointer' }} aria-label="delete-ad">Удалить</button>
            </div>
          )}

          {!owner && (
            <button type="button" style={{ width: '100%', height: 44, borderRadius: 10, border: '1px solid #000', background: '#000', color: '#fff', cursor: 'pointer', marginTop: 8 }} aria-label="contact-seller">Связаться</button>
          )}

          {(error || actionError) && (
            <div style={{ marginTop: 12, color: '#b00020', fontSize: 13 }} role="alert">
              {actionError || error}
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
