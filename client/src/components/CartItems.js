import React, { useEffect, useState } from 'react';
import { fetchCartItems } from '../http/cartAPI';  // Импортируем API для корзины

function CartItems({ userId }) {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (userId) {
      fetchCartItems(userId).then(data => {
        setCartItems(data);
      });
    }
  }, [userId]);

  return (
    <div>
      {cartItems.length > 0 ? (
        <ul>
          {cartItems.map(item => (
            <li key={item.id}>{item.name} - {item.quantity}</li>
          ))}
        </ul>
      ) : (
        <p>Корзина пуста</p>
      )}
    </div>
  );
}

export default CartItems;
