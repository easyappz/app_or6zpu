import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './Landing.css';
import { listAds, addFavorite, removeFavorite } from '../api/ads';
import { listCategories } from '../api/categories';
import AdCard from '../components/AdCard.jsx';
import Pagination from '../components/Pagination.jsx';
import { useNavigate } from 'react-router-dom';

const DEFAULT_PAGE_SIZE = 12;

export default function Landing() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(false);

  const [filters, setFilters] = useState({
    category_id: '',
    price_min: '',
    price_max: '',
    date_from: '',
    date_to: '',
    ordering: '-created_at',
    location: '',
    q: '',
  });

  const [page, setPage] = useState(1);
  const [pageSize] = useState(DEFAULT_PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState({ count: 0, results: [] });

  const isAuth = useMemo(() => {
    try {
      return Boolean(localStorage.getItem('token'));
    } catch (_) {
      return false;
    }
  }, []);

  const loadCategories = useCallback(async () => {
    setLoadingCats(true);
    try {
      const cats = await listCategories();
      setCategories(cats || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingCats(false);
    }
  }, []);

  const applyFilters = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const payload = await listAds({ ...filters, page, page_size: pageSize });
      setData({ count: payload?.count || 0, results: payload?.results || [] });
    } catch (e) {
      const message = e?.response?.data?.detail || 'Не удалось загрузить объявления';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [filters, page, pageSize]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const onApply = () => {
    setPage(1);
    applyFilters();
  };

  const onReset = () => {
    setFilters({
      category_id: '',
      price_min: '',
      price_max: '',
      date_from: '',
      date_to: '',
      ordering: '-created_at',
      location: '',
      q: '',
    });
    setPage(1);
  };

  const onToggleFavorite = async (ad) => {
    if (!isAuth) {
      navigate('/login');
      return;
    }
    try {
      if (ad.is_favorite) {
        await removeFavorite(ad.id);
      } else {
        await addFavorite(ad.id);
      }
      // Update local state
      setData((prev) => ({
        ...prev,
        results: prev.results.map((a) => (a.id === ad.id ? { ...a, is_favorite: !ad.is_favorite } : a)),
      }));
    } catch (e) {
      const message = e?.response?.data?.detail || 'Ошибка при изменении избранного';
      alert(message);
    }
  };

  const handleChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section data-easytag="id1-src/pages/Landing.jsx" className="landing-wrap">
      <header className="header-row" data-easytag="id2-src/pages/Landing.jsx">
        <h2 style={{ margin: 0 }}>Объявления</h2>
        <div className="meta">Найдено: {data.count}</div>
      </header>

      <div className="filters-bar" data-easytag="id3-src/pages/Landing.jsx">
        <div className="field">
          <label htmlFor="category">Категория</label>
          <select
            id="category"
            value={filters.category_id}
            onChange={(e) => handleChange('category_id', e.target.value)}
            disabled={loadingCats}
            aria-label="Категория"
          >
            <option value="">Все</option>
            {categories.map((c) => (
              <option key={c.id} value={String(c.id)}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="price_min">Цена от</label>
          <input
            id="price_min"
            type="number"
            inputMode="decimal"
            value={filters.price_min}
            onChange={(e) => handleChange('price_min', e.target.value)}
            placeholder="0"
            aria-label="Минимальная цена"
          />
        </div>

        <div className="field">
          <label htmlFor="price_max">Цена до</label>
          <input
            id="price_max"
            type="number"
            inputMode="decimal"
            value={filters.price_max}
            onChange={(e) => handleChange('price_max', e.target.value)}
            placeholder="100000"
            aria-label="Максимальная цена"
          />
        </div>

        <div className="field">
          <label htmlFor="date_from">Дата с</label>
          <input
            id="date_from"
            type="date"
            value={filters.date_from}
            onChange={(e) => handleChange('date_from', e.target.value)}
            aria-label="Дата с"
          />
        </div>

        <div className="field">
          <label htmlFor="date_to">Дата по</label>
          <input
            id="date_to"
            type="date"
            value={filters.date_to}
            onChange={(e) => handleChange('date_to', e.target.value)}
            aria-label="Дата по"
          />
        </div>

        <div className="field" style={{ minWidth: 220, flex: 1 }}>
          <label htmlFor="location">Местоположение</label>
          <input
            id="location"
            type="text"
            value={filters.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="Город, район"
            aria-label="Местоположение"
          />
        </div>

        <div className="field" style={{ minWidth: 240, flex: 2 }}>
          <label htmlFor="q">Ключевые слова</label>
          <input
            id="q"
            type="text"
            value={filters.q}
            onChange={(e) => handleChange('q', e.target.value)}
            placeholder="Что ищем?"
            aria-label="Ключевые слова"
          />
        </div>

        <div className="filters-actions" data-easytag="id4-src/pages/Landing.jsx">
          <button type="button" onClick={onApply} style={{ fontWeight: 600 }}>
            Применить
          </button>
          <button type="button" onClick={onReset}>
            Сбросить
          </button>
        </div>
      </div>

      {error && (
        <div data-easytag="id5-src/pages/Landing.jsx" style={{ color: '#b00020', padding: '8px 0' }}>
          {error}
        </div>
      )}

      <div data-easytag="id6-src/pages/Landing.jsx" className="grid" aria-live="polite">
        {loading ? (
          <div style={{ textAlign: 'center', padding: 24, gridColumn: '1/-1' }}>Загрузка…</div>
        ) : (
          data.results.map((ad) => (
            <AdCard key={ad.id} ad={ad} onToggleFavorite={onToggleFavorite} isAuth={isAuth} />
          ))
        )}
        {!loading && data.results.length === 0 && (
          <div style={{ textAlign: 'center', padding: 24, gridColumn: '1/-1', color: '#666' }}>Ничего не найдено</div>
        )}
      </div>

      <div data-easytag="id7-src/pages/Landing.jsx">
        <Pagination
          page={page}
          pageSize={pageSize}
          totalCount={data.count}
          onChangePage={(p) => {
            setPage(p);
          }}
        />
      </div>
    </section>
  );
}
