require('dotenv').config();
const express = require('express');
const sequelize = require('./db');
const models = require('./models/models');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const router = require('./routes/index');
const errorHandler = require('./middleware/ErrorHandlingMiddleware');
const path = require('path');
const WebSocket = require('ws');

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use(fileUpload({}));
app.use('/api', router);

// Обработка ошибок (последний Middleware)
app.use(errorHandler);

// WebSocket сервер
const wss = new WebSocket.Server({ port: 8080 });
const clients = new Map(); // Хранилище подключений

// Функция для рассылки обновлений корзины
const broadcastCartUpdate = (userId, cartData) => {
  clients.forEach((ws, id) => {
    if (id === userId) {
      ws.send(JSON.stringify({ userId, cartData }));
    }
  });
};

// Обработка WebSocket-соединений
wss.on('connection', (ws, req) => {
  const userId = req.headers['sec-websocket-protocol']; // Получаем userId из заголовка
  if (userId) clients.set(userId, ws); // Сохраняем соединение для пользователя

  ws.on('close', () => {
    clients.delete(userId); // Удаляем соединение, если клиент отключился
  });

  ws.on('error', (err) => {
    console.error('WebSocket ошибка:', err);
  });
});

// Экспорт функции для использования в контроллерах
module.exports.broadcastCartUpdate = broadcastCartUpdate;

// Запуск сервера
const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    console.log('WebSocket Server running on port 8080');
  } catch (e) {
    console.log(e);
  }
};

start();
