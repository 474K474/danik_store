import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/HomePage.css';

function HomePage({ products }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  
  // Переход на страницу при клике на фото
  const handleImageClick = () => {
    navigate(`/product/${products[currentIndex].id}`);
  };

  return (
    <div className="homepage">
      {/* Основной блок с крупным изображением */}
      <div className="hero-section">
        <div className="hero-image" onClick={handleImageClick}>
          <img src={require(`../assets/logo.jpg`)} alt="Product" />
        </div>
        <div className="hero-content">
          <h1 className='h1'>БЫТЬ СОБОЙ</h1>
          <h2 className='h2'>ТВОЙ ВЫБОР</h2>
          <div className="hero-buttons">
            <button onClick={() => navigate('/male-products')}>Я ВЫБРАЛ</button>
            <button onClick={() => navigate('/female-products')}>Я ВЫБРАЛА</button>
          </div>
        </div>
      </div>

      {/* Секция продуктов */}
      <div className="product-section">
        <h2 className="title">ВСЕ ЧТО НУЖНО ДЛЯ СПОРТА ЗДЕСЬ</h2>
        <div className="product-grid">
          <div className="product-item" onClick={() => navigate('/custom-embroidery')}>
            <img src={require("../assets/nike.png")} alt="Вышивка" />
            <h3 className="overlay-text">ВЫШИВКА НА ЗАКАЗ</h3>
          </div>
          <div className="product-item" onClick={() => navigate('/gym-equipment')}>
            <img src={require("../assets/gymshark.png")} alt="Спортивное снаряжение" />
            <h3 className="overlay-text">СПОРТИВНОЕ СНАРЯЖЕНИЕ</h3>
          </div>
          <div className="product-item" onClick={() => navigate('/male-clothes')}>
            <img src={require("../assets/male-clothes.png")} alt="Мужская одежда" />
            <h3 className="overlay-text">МУЖСКАЯ ОДЕЖДА</h3>
          </div>
          <div className="product-item" onClick={() => navigate('/female-clothes')}>
            <img src={require("../assets/female-clothes.png")} alt="Женская одежда" />
            <h3 className="overlay-text">ЖЕНСКАЯ ОДЕЖДА</h3>
          </div>
        </div>
      </div>

      {/* Нижняя часть с текстом */}
      <div className="additional-section">
        <h3 className="title">ОДЕЖДА ДЛЯ ЗАЛА И ВОРКАУТА</h3>
        <p>
          Одежда говорит многое о человеке, поэтому дизайн нашей одежды поможет рассказать о себе.
        </p>
        <h3 className="title">БОЛЬШЕ ЧЕМ ПРОСТО ОДЕЖДА</h3>
        <p>Мы продаем возможности, а не товары.</p>
      </div>
    </div>
  );
}

export default HomePage;
