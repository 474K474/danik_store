import { $authHost } from './index.js';  // Используем авторизованный хост

// Функция для добавления товара в корзину
export const addToCart = async (productId, size) => {
  try {
    const response = await $authHost.post('/api/cart/add', { productId, size });
    return response.data;
  } catch (error) {
    console.error('Ошибка при добавлении товара в корзину:', error);
    throw error;
  }
};

// Функция для получения товаров в корзине
export const fetchCartItems = async (userId) => {
  try {
    const { data } = await $authHost.get(`/cart/${userId}`);  // Запрос к серверу для получения корзины
    return data;
  } catch (error) {
    console.error('Ошибка при получении корзины:', error);
    return [];
  }
};

// Функция для удаления товара из корзины
export const removeFromCart = async (productId) => {
  try {
    await $authHost.delete(`/api/cart/remove/${productId}`);
  } catch (error) {
    console.error('Ошибка при удалении товара из корзины:', error);
    throw error;
  }
};

// Другие функции для работы с корзиной (например, увеличение/уменьшение количества товаров) можно добавить аналогичным образом
