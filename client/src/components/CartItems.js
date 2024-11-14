import React, { useEffect, useState } from 'react';
import '../css/CartItems.css';

const CartItems = ({ cartItems, setCartItems, onRemoveItem }) => {
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId'); // Получаем ID пользователя
    const websocket = new WebSocket(`ws://localhost:8080`, userId); // Передаем userId через WebSocket протокол

    websocket.onmessage = (event) => {
      const { userId: updatedUserId, cartData } = JSON.parse(event.data);
      if (String(updatedUserId) === userId) {
        setCartItems(cartData); // Обновляем состояние корзины
      }
    };

    websocket.onclose = () => {
      console.log('WebSocket закрыт. Переподключение...');
      setTimeout(() => setWs(new WebSocket(`ws://localhost:8080`, userId)), 5000); // Переподключение
    };

    setWs(websocket);

    return () => {
      websocket.close(); // Закрываем WebSocket при размонтировании компонента
    };
  }, [setCartItems]);

  const generateTelegramMessage = () => {
    if (cartItems.length === 0) return '';

    let message = 'Здравствуйте, я хочу купить у вас:\n';
    let total = 0;

    cartItems.forEach((item) => {
      message += `- ${item.name}, ${item.price} Тг, размер: ${item.size}\n`;
      total += item.price * item.quantity;
    });

    message += `\nОбщая сумма: ${total} Тг`;
    return encodeURIComponent(message);
  };

  const telegramUrl = `https://t.me/mambich474?text=${generateTelegramMessage()}`;

  return (
    <div className="cart-container">
      {cartItems.length > 0 ? (
        cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-image">
              <img
                src={`${process.env.REACT_APP_API_URL}${item.imageUrl}`}
                alt={item.name || 'Нет названия'}
                onError={(e) => (e.target.src = '/default-image.jpg')}
              />
            </div>
            <div className="cart-item-details">
              <h3>{item.name}</h3>
              <p>Размер: {item.size}</p>
              <p>Цена: {item.price} Тг</p>
            </div>
            <div className="cart-item-quantity">
              <p>Кол-во: {item.quantity}</p>
            </div>
            <div className="cart-item-remove">
              <button onClick={() => onRemoveItem(item.productId)}>Удалить</button>
            </div>
          </div>
        ))
      ) : (
        <p>Корзина пуста</p>
      )}
      {cartItems.length > 0 && (
        <div className="cart-buy-button">
          <a href={telegramUrl} target="_blank" rel="noopener noreferrer">
            <button>Купить</button>
          </a>
        </div>
      )}
    </div>
  );
};

export default CartItems;
