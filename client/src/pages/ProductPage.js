import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { $authHost } from '../http';
import { Context } from '../index';
import '../css/ProductPage.css';
import { addToCart } from '../http/cartAPI';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // Получаем текущий маршрут
  const { user } = useContext(Context);
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    $authHost.get(`/api/product/${id}`)
      .then(response => {
        setProduct(response.data);
        setSelectedImage(response.data.images[0].fileName);
      })
      .catch(error => {
        console.error('Ошибка при загрузке продукта:', error);
      });
  }, [id]);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleAddToCart = async () => {
    if (!user.isAuth) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
  
    if (!selectedSize) {
      alert('Пожалуйста, выберите размер');
      return;
    }
  
    try {
      await addToCart(user.user.id, product.id, selectedSize); // Используем функцию из cartAPI
      alert('Товар добавлен в корзину');
    } catch (error) {
      console.error('Ошибка при добавлении товара в корзину:', error);
      alert('Не удалось добавить товар в корзину');
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
            onClick={() => setIsZoomed(!isZoomed)}
            style={{ width: isZoomed ? '500px' : '400px', cursor: 'zoom-in' }}
          />
        </div>
      </div>
      <div className="product-details">
        <h2>{product.name}</h2>
        <h5>Цена: {product.price} тг</h5>
        <div className="sizes">
          <h6>Размер:</h6>
          <div className='SizeButton'>
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
        </div>
        <button onClick={handleAddToCart} disabled={!selectedSize}>
          Добавить в корзину
        </button>
        <div className="product-info">
          <h3>Информация:</h3>
          {product.info.map(info => (
            <h6 className='InfoText' key={info.title}>{info.title}: {info.description}</h6>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
