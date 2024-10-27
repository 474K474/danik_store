import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { $authHost } from '../http';
import '../css/shop.css';
import queryString from 'query-string';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [limit] = useState(6);

  const navigate = useNavigate();
  const location = useLocation();

  // Извлекаем параметры из URL (categoryId, typeId обязательные)
  const { categoryId, typeId, colorIds, syzeIds, page, sortBy } = queryString.parse(location.search);

  const [selectedCategory, setSelectedCategory] = useState(categoryId || '');
  const [selectedType, setSelectedType] = useState(typeId || '');
  const [selectedColors, setSelectedColors] = useState(colorIds ? JSON.parse(colorIds) : []);
  const [selectedSizes, setSelectedSizes] = useState(syzeIds ? JSON.parse(syzeIds) : []);
  const [currentPage, setPage] = useState(page ? parseInt(page, 10) : 1);
  const [currentSortBy, setSortBy] = useState(sortBy || '');

  const [isFirstRender, setIsFirstRender] = useState(true);

  // Обновление URL при изменении фильтров
  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
      return;
    }

    const params = queryString.stringify({
      categoryId: selectedCategory ? Number(selectedCategory) : undefined,
      typeId: selectedType ? Number(selectedType) : undefined,
      colorIds: selectedColors.length ? JSON.stringify(selectedColors) : undefined,
      syzeIds: selectedSizes.length ? JSON.stringify(selectedSizes) : undefined,
      page: currentPage !== 1 ? currentPage : undefined,
      sortBy: currentSortBy || undefined,
    });

    navigate({ search: params });
  }, [selectedCategory, selectedType, selectedColors, selectedSizes, currentPage, currentSortBy, navigate]);

  // Перезагрузка данных при изменении categoryId или typeId в URL
  useEffect(() => {
    setSelectedCategory(categoryId || '');
    setSelectedType(typeId || '');
    setPage(1);
  }, [categoryId, typeId]);

  // Загрузка фильтров (категории, цвета, размеры)
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [categoriesResponse, colorsResponse, sizesResponse] = await Promise.all([
          $authHost.get('/api/category'),
          $authHost.get('/api/color'),
          $authHost.get('/api/syze'),
        ]);
        setCategories(categoriesResponse.data);
        setColors(colorsResponse.data);
        setSizes(sizesResponse.data);
      } catch (error) {
        console.error('Ошибка загрузки фильтров:', error);
      }
    };
    fetchFilters();
  }, []);

  // Загрузка продуктов с учетом обязательных параметров categoryId и typeId
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await $authHost.get('/api/product', {
          params: {
            categoryId: selectedCategory,
            typeId: selectedType,
            colorIds: selectedColors.length ? JSON.stringify(selectedColors) : null,
            syzeIds: selectedSizes.length ? JSON.stringify(selectedSizes) : null,
            limit,
            page: currentPage,
            sortBy: currentSortBy,
          },
        });
        setProducts(response.data.rows);
        setTotalProducts(response.data.count);
      } catch (error) {
        console.error('Ошибка загрузки продуктов:', error);
      }
    };
    fetchProducts();
  }, [selectedCategory, selectedType, selectedColors, selectedSizes, currentPage, limit, currentSortBy]);

  
  // Обработчики изменения фильтров
  const handleCategoryChange = (categoryId) => setSelectedCategory(categoryId);
  const handleTypeChange = (typeId) => setSelectedType(typeId);
  const handleColorToggle = (colorId) => {
    setSelectedColors((prev) =>
      prev.includes(colorId) ? prev.filter((id) => id !== colorId) : [...prev, colorId]
    );
  };
  const handleSizeToggle = (sizeId) => {
    setSelectedSizes((prev) =>
      prev.includes(sizeId) ? prev.filter((id) => id !== sizeId) : [...prev, sizeId]
    );
  };
  const handlePageChange = (newPage) => setPage(newPage);

  const goToProductPage = (id) => {
    navigate(`/product/${id}`);
  };

  // Обработчик выбора сортировки
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(1);
  };

  // Сбросить все фильтры
  const resetFilters = () => {
    setSelectedColors([]);
    setSelectedSizes([]);
    setSortBy('');
    setPage(1);
  };

  return (
    <div className="shop">
      <div className="filters">
        <h2>Продукты</h2>

        <button className="reset-button" onClick={resetFilters}>Убрать все</button>

        {/* Фильтр цветов */}
        <div className="filter-color">
          <h3>Цвета</h3>
          {colors.map((color) => (
            <label key={color.id}>
              <input
                type="checkbox"
                checked={selectedColors.includes(color.id)}
                onChange={() => handleColorToggle(color.id)}
              />
              {color.name}
            </label>
          ))}
        </div>

        {/* Фильтр размеров */}
        <div className="filter-size">
          <h3>Размеры</h3>
          {sizes.map((size) => (
            <label key={size.id}>
              <input
                type="checkbox"
                checked={selectedSizes.includes(size.id)}
                onChange={() => handleSizeToggle(size.id)}
              />
              {size.name}
            </label>
          ))}
        </div>

        {/* Сортировка */}
        <div className="sort-options">
          <h3>Сортировать по:</h3>
          <select value={currentSortBy} onChange={handleSortChange}>
            <option value="">Без сортировки</option>
            <option value="price-asc">Цена (по возрастанию)</option>
            <option value="price-desc">Цена (по убыванию)</option>
            <option value="name-asc">Название (по алфавиту)</option>
            <option value="name-desc">Название (обратный алфавит)</option>
          </select>
        </div>
      </div>

      {/* Отображение товаров */}
      <div className="product-card">
        <div className="products">
        {products.map((product) => (
  <div key={product.id} className="product">
    <img
      src={`${process.env.REACT_APP_API_URL}/static/${product.images[0]?.fileName}`}
      alt={product.name}
      onClick={() => goToProductPage(product.id)}
      style={{ cursor: 'pointer' }}
    />
    <h3 onClick={() => goToProductPage(product.id)} style={{ cursor: 'pointer' }}>
      {product.name}
    </h3>
    <h6>{product.price} тг</h6>
  </div>
))}

        </div>

        {/* Пагинация */}
        <div className="pagination">
          {Array.from({ length: Math.ceil(totalProducts / limit) }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              className={currentPage === pageNum ? 'active' : ''}
              onClick={() => handlePageChange(pageNum)}
            >
              {pageNum}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shop;
