import { $authHost } from './index.js';  // Используем авторизованный хост

export const fetchCartItems = async (userId) => {
  try {
    const { data } = await $authHost.get(`/cart/${userId}`);  // Запрос к серверу для получения корзины
    return data;
  } catch (error) {
    console.error('Ошибка при получении корзины:', error);
    return [];
  }
};
