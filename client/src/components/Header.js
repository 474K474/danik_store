import React, { useState, useContext, useEffect } from 'react';
import '../css/header.css';
import { useNavigate } from 'react-router-dom';
import { Context } from '../index'; // Используем контекст для работы с авторизацией и данными
import CartItems from './CartItems.js'; // Импортируем компонент CartItems
import { fetchUserData, logout } from '../http/userAPI'; 
import { fetchProductById } from '../http/productAPI'; // Импорт API для поиска продуктов
import { fetchCartItems, removeCartItem } from '../http/cartAPI';

function Header() {
  const { user } = useContext(Context);
  const [activeMenu, setActiveMenu] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // Для строки поиска
  const [errorMessage, setErrorMessage] = useState(''); // Сообщение об ошибке
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData().then((data) => {
      user.setUser(data);
    });
  }, []);

  // Загружаем данные корзины единожды
  useEffect(() => {
    if (user.user) {
      const loadCartItems = async () => {
        try {
          const items = await fetchCartItems(user.user.id);
          setCartItems(items);
        } catch (error) {
          console.error('Ошибка при загрузке корзины:', error);
        }
      };
      loadCartItems();
    }
  }, [user.user]);

  // Обновляем данные корзины
  const handleRemoveCartItem = async (cartItemId) => {
    try {
      await removeCartItem(cartItemId);
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== cartItemId));
    } catch (error) {
      console.error('Ошибка при удалении товара из корзины:', error);
    }
  };

  const navigateToShop = (category, type) => {
    setActiveMenu(null);
    navigate(`/shop?categoryId=${category}&typeId=${type}`);
  };

  const handleMouseEnter = (menu) => {
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    setActiveMenu(null);
  };

  const handleLogout = () => {
    user.setUser({});
    user.setIsAuth(false);
    logout();
    navigate('/');
  };

  const handleSearch = async () => {
    const searchInput = document.getElementById("search-input");
  
    searchInput.setCustomValidity("");
    setErrorMessage('');
  
    try {
        let product;
            // Проверка на ID
            product = await fetchProductById(searchQuery);
  
        // Если продукт найден, переходим на его страницу
        if (product && product.id) {
            navigate(`/product/${product.id}`);
            setSearchQuery('');
        } else {
            searchInput.setCustomValidity("Товар не найден");
            searchInput.reportValidity();
        }
    } catch (error) {
        searchInput.setCustomValidity("Ошибка при выполнении поиска");
        searchInput.reportValidity();
    }
};

  return (
    <>
      <header className="header">
        <div className="header-logo" onClick={() => navigate('/')}>
          <img src={require('../assets/logo.jpg')} alt="Logo" />
        </div>
        <nav className="header-nav">
          <a onMouseEnter={() => handleMouseEnter('male')}>Мужчинам</a>
          <a onMouseEnter={() => handleMouseEnter('female')}>Женщинам</a>
          <a onMouseEnter={() => handleMouseEnter('accessories')}>Аксессуары</a>
        </nav>

        <div className="header-search">
          <input
            id="search-input" // Добавляем id для идентификации элемента
            type="text"
            placeholder="Поиск по ID" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            pattern="\d+|[A-Za-zА-Яа-я]+" // Пример для поиска по ID или имени
            title="Введите ID или имя продукта"
            required
          />
          <button onClick={handleSearch}>
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
          <span className="cart-count">{cartItems.length}</span>
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
                <p onClick={() => navigateToShop('1', '1')}>Футболки</p>
                <p onClick={() => navigateToShop('1', '2')}>Худи</p>
                <p onClick={() => navigateToShop('1', '3')}>Трико</p>
                <p onClick={() => navigateToShop('1', '4')}>Шорты</p>
              </div>
              <div className="column">
                <h3>Аксессуары</h3>
                <p onClick={() => navigateToShop('3', '5')}>Обмотки</p>
                <p onClick={() => navigateToShop('3', '6')}>Пояса для зала</p>
              </div>
            </div>
          )}
          {activeMenu === 'female' && (
            <div className="dropdown-content">
              <div className="column">
                <h3>Одежда</h3>
                <p onClick={() => navigateToShop('2', '1')}>Футболки</p>
                <p onClick={() => navigateToShop('2', '2')}>Худи</p>
                <p onClick={() => navigateToShop('2', '3')}>Трико</p>
                <p onClick={() => navigateToShop('2', '4')}>Шорты</p>
              </div>
              <div className="column">
                <h3>Аксессуары</h3>
                <p onClick={() => navigateToShop('3', '5')}>Обмотки</p>
                <p onClick={() => navigateToShop('3', '6')}>Пояса для зала</p>
              </div>
            </div>
          )}
          {activeMenu === 'accessories' && (
            <div className="dropdown-content">
              <div className="column">
                <h3>Аксессуары</h3>
                <p onClick={() => navigateToShop('3', '5')}>Обмотки</p>
                <p onClick={() => navigateToShop('3', '6')}>Пояса для зала</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Всплывающее меню аккаунта */}
      { showAccount && (
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
            <CartItems
              cartItems={cartItems}
              onRemoveItem={handleRemoveCartItem}
            />
          ) : (
            <p>Войдите для просмотра корзины</p>
          )}
        </div>
      )}
    </>
  );
}

export default Header;
