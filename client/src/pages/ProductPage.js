import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { $authHost } from '../http'; // Импортируем axios с настройками авторизации
import { Context } from '../index'; // Для доступа к контексту пользователя
import '../css/ProductPage.css';

const ProductPage = () => {
  const { id } = useParams(); // Получение id продукта из URL
  const navigate = useNavigate(); // Используем useNavigate вместо useHistory
  const { user } = useContext(Context); // Подключаем контекст для работы с хранилищем пользователя
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    // Загрузка информации о продукте
    $authHost.get(`/api/product/${id}`)
      .then(response => {
        setProduct(response.data);
        setSelectedImage(response.data.images[0].fileName); // Установка первой картинки как выбранной
      })
      .catch(error => {
        console.error('Ошибка при загрузке продукта:', error);
      });
  }, [id]);

  const handleImageClick = (image) => {
    setSelectedImage(image); // Установка выбранного изображения
  };

  const handleAddToCart = async () => {
    // Проверка авторизации через middleware
    try {
      await $authHost.post('/api/cart/add', { productId: id, size: selectedSize });
      alert('Товар добавлен в корзину');
    } catch (error) {
      if (error.response.status === 401) {
        // Перенаправление на страницу авторизации, если пользователь не авторизован
        navigate('/login');
      } else {
        console.error('Ошибка при добавлении товара в корзину:', error);
      }
    }
  };

  if (!product) return <div>Загрузка...</div>;

  return (
    <div className="product-page">
      <div className="product-images">
        <div className="thumbnails">
          {product.images.map(img => (
            <img
              key={img.fileName}
              src={`${process.env.REACT_APP_API_URL}/static/${img.fileName}`}
              alt={product.name}
              onClick={() => handleImageClick(img.fileName)}
              style={{
                border: selectedImage === img.fileName ? '2px solid black' : 'none',
                cursor: 'pointer'
              }}
            />
          ))}
        </div>
        <div className="main-image">
          <img
            src={`${process.env.REACT_APP_API_URL}/static/${selectedImage}`}
            alt={product.name}
            onClick={() => setIsZoomed(!isZoomed)} // Увеличение картинки при нажатии
            style={{ width: isZoomed ? '500px' : '300px', cursor: 'zoom-in' }}
          />
        </div>
      </div>
      <div className="product-details">
        <h2>{product.name}</h2>
        <p>Цена: {product.price} тг</p>
        <div className="sizes">
          <p>Размер:</p>
          {product.syzes.map(size => (
            <button
              key={size.id}
              onClick={() => setSelectedSize(size.name)}
              style={{
                border: selectedSize === size.name ? '2px solid black' : '1px solid gray',
                cursor: 'pointer'
              }}
            >
              {size.name}
            </button>
          ))}
        </div>
        <button onClick={handleAddToCart} disabled={!selectedSize}>
          Добавить в корзину
        </button>
        <div className="product-info">
          <h3>Информация:</h3>
          {product.info.map(info => (
            <p key={info.title}>{info.title}: {info.description}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
