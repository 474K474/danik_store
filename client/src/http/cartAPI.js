import { $authHost } from './index.js'; 


export const fetchCart = async (userId) => {
    const { data } = await $authHost.get(`/cart/${userId}`);
    return data;
};


// Функция для добавления товара в корзину// Функция для добавления товара в корзину
export const addToCart = async (userId, productId, size) => {
  try {
    const response = await $authHost.post('/api/cart/add', { userId, productId, size });
    return response.data;
  } catch (error) {
    console.error('Ошибка при добавлении товара в корзину:', error);
    throw error;
  }
};


// Исправляем маршрут на корректный
export const fetchCartItems = async (userId) => {
  try {
    const { data } = await $authHost.get(`/api/cart/${userId}`);
    return data;
  } catch (error) {
    console.error('Ошибка при получении корзины:', error);
    return [];
  }
};

// Исправляем маршрут удаления товара
export const removeCartItem = async (productId) => {
  try {
    await $authHost.delete(`/api/cart/remove/${productId}`);
  } catch (error) {
    console.error('Ошибка при удалении товара из корзины:', error);
    throw error;
  }
};
