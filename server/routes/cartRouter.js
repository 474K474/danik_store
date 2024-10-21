const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');

// Получить корзину пользователя
router.get('/', authMiddleware, cartController.getUserCart);

// Удалить товар из корзины
router.delete('/remove/:productId', authMiddleware, cartController.removeFromCart);

// Увеличить количество товара
router.patch('/increase/:productId', authMiddleware, cartController.increaseQuantity);

// Уменьшить количество товара
router.patch('/decrease/:productId', authMiddleware, cartController.decreaseQuantity);

module.exports = router;