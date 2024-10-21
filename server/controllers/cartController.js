const { Cart, Product, User } = require('../models/models');
const ApiError = require('../error/ApiError');

exports.addToCart = async (req, res) => {
    const { userId, productId } = req.body;

    try {
        const user = await User.findByPk(userId);
        const product = await Product.findByPk(productId);

        if (!user || !product) {
            return res.status(404).json({ message: 'Пользователь или продукт не найдены' });
        }

        const cartItem = await Cart.create({ userId, productId });
        res.status(201).json(cartItem);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка добавления продукта в корзину', error });
    }
};

// Удаление продукта из корзины
exports.removeFromCart = async (req, res) => {
    const { userId, productId } = req.body;

    try {
        const cartItem = await Cart.findOne({ where: { userId, productId } });

        if (!cartItem) {
            return res.status(404).json({ message: 'Продукт не найден' });
        }

        await cartItem.destroy();
        res.status(200).json({ message: 'Продукт удален из корзины' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка удаления продукта из корзины', error });
    }
};

// Получение всех товаров в корзине пользователя
exports.getUserCart = async (req, res) => {
    const { userId } = req.params;

    try {
        const cartItems = await Cart.findAll({
            where: { userId },
            include: [Product] // Включаем данные о продуктах
        });

        res.status(200).json(cartItems);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка извлечения корзины пользователя', error });
    }
};


// Увеличение количества товара в корзине
exports.increaseQuantity = async (req, res) => {
    const { productId } = req.params;
    const { userId } = req.user;  // Получаем ID пользователя из токена

    try {
        const cartItem = await CartProduct.findOne({ where: { userId, productId } });
        if (!cartItem) {
            return res.status(404).json({ message: 'Товар не найден в корзине' });
        }

        cartItem.quantity += 1;  // Увеличиваем количество товара на 1
        await cartItem.save();
        res.status(200).json(cartItem);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при увеличении количества товара', error });
    }
};


// Уменьшение количества товара в корзине
exports.decreaseQuantity = async (req, res) => {
    const { productId } = req.params;
    const { userId } = req.user;  // Получаем ID пользователя из токена

    try {
        const cartItem = await CartProduct.findOne({ where: { userId, productId } });
        if (!cartItem) {
            return res.status(404).json({ message: 'Товар не найден в корзине' });
        }

        if (cartItem.quantity > 1) {
            cartItem.quantity -= 1;  // Уменьшаем количество товара на 1
            await cartItem.save();
            res.status(200).json(cartItem);
        } else {
            // Если количество товара == 1, можно его удалить
            await cartItem.destroy();
            res.status(200).json({ message: 'Товар удален из корзины' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при уменьшении количества товара', error });
    }
};
