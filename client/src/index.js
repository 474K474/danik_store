import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client'; // Используем 'react-dom/client'
import App from './App';
import UserStore from './store/UserStore';

export const Context = createContext(null);

// Получаем элемент root
const rootElement = document.getElementById('root');

// Создаем root для React 18
const root = ReactDOM.createRoot(rootElement);

root.render(
    <Context.Provider value={{ user: new UserStore() }}>
        <App />
    </Context.Provider>
);
