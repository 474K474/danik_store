import React, { useState, useContext, useEffect } from 'react';
import '../css/header.css';
import { useNavigate } from 'react-router-dom';
import { Context } from '../index'; // Используем контекст для работы с авторизацией и данными
import CartItems from './CartItems.js'; // Импортируем компонент CartItems
import { fetchUserData, logout } from '../http/userAPI'; 


function Header() {
  const { user } = useContext(Context); // Подключаем контекст для работы с авторизацией
  const [activeMenu, setActiveMenu] = useState(null);
  const [showCart, setShowCart] = useState(false);  // Окно корзины
  const [showAccount, setShowAccount] = useState(false);  // Окно аккаунта
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData().then((data) => {
      user.setUser(data)      
    })
  }, []);
  
  const navigateToShop = (category, type) => {
    setActiveMenu(null);
    navigate(`/shop?categoryId=${category}&typeId=${type}`);
  };

  const handleMouseEnter = (maleu) => {
    setActiveMenu(maleu);
  };

  const handleMouseLeave = () => {
    setActiveMenu(null);
  };

  const handleLogout = () => {
    user.setUser({});
    user.setIsAuth(false);
    logout()
    navigate('/');
  };

  return (
    <>
      <header className="header">
        <div className="header-logo" onClick={() => navigate('/')}>
          <img src={require('../assets/logo.jpg')} alt="Logo" />
        </div>
        <nav className="header-nav">
          <a href="#" onMouseEnter={() => handleMouseEnter('male')}>Мужчинам</a>
          <a href="#" onMouseEnter={() => handleMouseEnter('female')}>Женщинам</a>
          <a href="#" onMouseEnter={() => handleMouseEnter('accessories')}>Аксессуары</a>
        </nav>

        <div className="header-search">
          <input type="text" placeholder="Поиск" />
          <button>
            <img src={require('../assets/search.png')} alt="search-icon" />
          </button>
        </div>

        <div className="header-icons">
          {/* Иконка аккаунта */}
          <img 
            src={require('../assets/user.png')} 
            alt="user-icon" 
            onMouseEnter={() => setShowAccount(true)} 
            onMouseLeave={() => setShowAccount(false)} 
          />

          {/* Иконка корзины */}
          <img 
            src={require('../assets/cart.png')} 
            alt="cart-icon" 
            onMouseEnter={() => setShowCart(true)} 
            onMouseLeave={() => setShowCart(false)} 
          />
        </div>
      </header>

      {/* Выпадающее меню */}
      {activeMenu && (
        <div 
          className={`dropdown ${activeMenu ? 'dropdown-active' : ''}`}
          onMouseEnter={() => handleMouseEnter(activeMenu)}
          onMouseLeave={handleMouseLeave}
        >
          {activeMenu === 'male' && (
            <div className="dropdown-content">
              <div className="column">
                <h3>Одежда</h3>
                <p onClick={() => navigateToShop('male', 'tshirts')}>Футболки</p>
                <p onClick={() => navigateToShop('male', 'hoodies')}>Худи</p>
                <p onClick={() => navigateToShop('male', 'trousers')}>Трико</p>
                <p onClick={() => navigateToShop('male', 'shorts')}>Шорты</p>
              </div>
              <div className="column">
                <h3>Аксессуары</h3>
                <p onClick={() => navigateToShop('accessories', 'wraps')}>Обмотки</p>
                <p onClick={() => navigateToShop('accessories', 'belts')}>Пояса для зала</p>
              </div>
            </div>
          )}
          {activeMenu === 'female' && (
            <div className="dropdown-content">
              <div className="column">
                <h3>Одежда</h3>
                <p onClick={() => navigateToShop('female', 'tshirts')}>Футболки</p>
                <p onClick={() => navigateToShop('female', 'hoodies')}>Худи</p>
                <p onClick={() => navigateToShop('female', 'trousers')}>Трико</p>
                <p onClick={() => navigateToShop('female', 'shorts')}>Шорты</p>
              </div>
              <div className="column">
                <h3>Аксессуары</h3>
                <p onClick={() => navigateToShop('accessories', 'wraps')}>Обмотки</p>
                <p onClick={() => navigateToShop('accessories', 'belts')}>Пояса для зала</p>
              </div>
            </div>
          )}
          {activeMenu === 'accessories' && (
            <div className="dropdown-content">
              <div className="column">
                <h3>Аксессуары</h3>
                <p onClick={() => navigateToShop('accessories', 'wraps')}>Обмотки</p>
                <p onClick={() => navigateToShop('accessories', 'belts')}>Пояса для зала</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Всплывающее меню аккаунта */}
      {showAccount && (
        <div className="account-popup account-popup-active" onMouseEnter={() => setShowAccount(true)} onMouseLeave={() => setShowAccount(false)}>
          <h3>Аккаунт</h3>
          {user.user ? (
            <>
              <p>Email: {user.user.email}</p>
              <button onClick={handleLogout}>Выйти</button>
            </>
          ) : (
            <>
              <p onClick={() => navigate('/login')}>Войти</p>
              <p onClick={() => navigate('/registration')}>Регистрация</p>
            </>
          )}
        </div>
      )}

      {/* Всплывающее меню корзины */}
      {showCart && (
        <div className="cart-popup cart-popup-active" onMouseEnter={() => setShowCart(true)} onMouseLeave={() => setShowCart(false)}>
          <h3>Корзина</h3>
          {user.user ? (
            <CartItems userId={user.user.id} />
          ) : (
            <p>Пожалуйста, войдите для просмотра корзины</p>
          )}
        </div>
      )}
    </>
  );
}

export default Header;
