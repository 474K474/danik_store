import React from 'react';
import '../css/CartItems.css';

const CartItems = ({ cartItems, onRemoveItem }) => {
  return (
    <div className="cart-container">
      {cartItems.length > 0 ? (
        cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            {/* Изображение продукта */}
            <div className="cart-item-image">
            <img
              src={`${process.env.REACT_APP_API_URL}${item.imageUrl}`} // Убираем лишнее /static
              alt={item.name || 'Нет названия'}
              onError={(e) => {
                e.target.src = '/default-image.jpg'; // Показываем заглушку, если изображение не загрузилось
              }}
            />

            </div>
            
            {/* Детали продукта */}
            <div className="cart-item-details">
              <h3>{item.name}</h3>
              <p>Размер: {item.size}</p>
              <p>Цена: {item.price} Тг</p>
            </div>
            
            {/* Количество */}
            <div className="cart-item-quantity">
              <p>Кол-во: {item.quantity}</p>
            </div>
            
            {/* Удаление из корзины */}
            <div className="cart-item-remove">
              <button onClick={() => onRemoveItem(item.id)}>Удалить</button>
            </div>
          </div>
        ))
      ) : (
        <p>Корзина пуста</p>
      )}
    </div>
  );
};

export default CartItems;
