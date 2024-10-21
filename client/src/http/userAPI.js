import { $authHost, $host } from "./index";
import { jwtDecode } from "jwt-decode";


export const fetchUserData = async () => {
  try {
    const { data } = await $authHost.get('api/user/me');  // запрос к /user/me
    return data;
  } catch (error) {
    console.error('Ошибка при получении данных пользователя:', error);
    return null;
  }
};

// Регистрация пользователя
export const registration = async (email, password) => {
  const { data } = await $host.post('api/user/registration', { email, password, role: 'USER' });
  localStorage.setItem('token', data.token);
  return jwtDecode(data.token);
};

// Вход пользователя
export const login = async (email, password) => {
  const { data } = await $host.post('api/user/login', { email, password });
  localStorage.setItem('token', data.token);
  return jwtDecode(data.token);
};

export const logout = async (email, password) => {
  // const { data } = await $host.post('api/user/logout');
  localStorage.setItem('token', undefined);
  window.location.reload()
};

// Проверка авторизации
export const check = async () => {
  const { data } = await $authHost.get('api/user/auth');
  localStorage.setItem('token', data.token);
  return jwtDecode(data.token);
};
