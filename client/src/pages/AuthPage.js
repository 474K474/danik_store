import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // useLocation для работы с маршрутом
import { registration, login, fetchUserData } from '../http/userAPI';
import { Context } from '../index';
import '../css/AuthPage.css';

const AuthPage = () => {
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation(); // Получение объекта location
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Проверка маршрута с учетом возможного отсутствия location
  const fromPage = location?.state?.from || '/';

  useEffect(() => {
    if (location?.pathname === '/login') {
      setIsLogin(true);
    } else if (location?.pathname === '/registration') {
      setIsLogin(false);
    }
  }, [location?.pathname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await registration(email, password);
      }
      fetchUserData().then((data) => {
        user.setUser(data);
      });
      user.setIsAuth(true);
      navigate(fromPage); // Перенаправление на страницу, с которой пришел пользователь
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>{isLogin ? 'Вход' : 'Регистрация'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Пароль:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit">
            {isLogin ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>
        <p onClick={() => navigate(isLogin ? '/registration' : '/login')}>
          {isLogin ? 'Еще нет аккаунта? Регистрация' : 'Уже есть аккаунт? Вход'}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
