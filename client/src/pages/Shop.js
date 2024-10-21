import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { $authHost } from '../http'; // axios с авторизацией
import '../css/shop.css'; // Подключаем стили

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [limit] = useState(6); // Отображение 6 товаров на страницу
  const navigate = useNavigate(); // Инициализируем navigate для переходов

  
  useEffect(() => {
    // Загрузка фильтров
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

  useEffect(() => {
    // Загрузка продуктов с учетом фильтров и пагинации
    const fetchProducts = async () => {
      try {
        const response = await $authHost.get('/api/product', {
          params: {
            categoryId: selectedCategory,
            colorIds: selectedColors.length ? JSON.stringify(selectedColors) : null,
            syzeIds: selectedSizes.length ? JSON.stringify(selectedSizes) : null,
            limit,
            page,
          },
        });
        setProducts(response.data.rows);
        setTotalProducts(response.data.count);
      } catch (error) {
        console.error('Ошибка загрузки продуктов:', error);
      }
    };
    fetchProducts();
  }, [selectedCategory, selectedColors, selectedSizes, page, limit]);

  const handleCategoryChange = (categoryId) => setSelectedCategory(categoryId);
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
    navigate(`/product/${id}`); // Переход на страницу товара с конкретным id
  };
  
  return (
    <div className="shop">
      <div className="filters">
        <div className="filter-color">
          <h3>Цвета</h3>
          {colors.map(color => (
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
        <div className="filter-size">
          <h3>Размеры</h3>
          {sizes.map(size => (
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
      </div>

      <div className="product-card">
        <h2>Продукты</h2>
        <div className="products">
          {products.map(product => (
            <div key={product.id} className="product">
              <img
                src={`${process.env.REACT_APP_API_URL}/static/${product.images[0]?.fileName}`}
                alt={product.name}
              />
              {/* Название продукта с обработчиком клика */}
              <h3 onClick={() => goToProductPage(product.id)} style={{ cursor: 'pointer' }}>
                {product.name}
              </h3>
              <p>{product.price} тг</p>
            </div>
          ))}
        </div>

        <div className="pagination">
          {Array.from({ length: Math.ceil(totalProducts / limit) }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              className={page === pageNum ? 'active' : ''}
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
