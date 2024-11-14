const { Product, CartProduct, Syze, Color, Image } = require('../models/models');
const { broadcastCartUpdate } = require('../index'); // Импорт WebSocket функции

// Добавление продукта в корзину
exports.addToCart = async (req, res) => {
    const { productId, size } = req.body;
    const userId = req.user.id;
  
    try {
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({ message: 'Продукт не найден' });
      }
  
      const existingCartItem = await CartProduct.findOne({ where: { userId, productId, size } });
  
      if (existingCartItem) {
        existingCartItem.quantity += 1;
        await existingCartItem.save();
      } else {
        await CartProduct.create({ userId, productId, size, quantity: 1 });
      }
  
      // Обновляем данные корзины и отправляем их через WebSocket
      const cartItems = await CartProduct.findAll({ where: { userId } });
      broadcastCartUpdate(userId, cartItems);
  
      res.status(200).json({ message: 'Продукт добавлен в корзину' });
    } catch (error) {
      console.error('Ошибка добавления в корзину:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  };

// Удаление продукта из корзины
exports.removeFromCart = async (req, res) => {
    const { productId } = req.params;
    const userId = req.user.id;

    try {
        const cartItem = await CartProduct.findOne({ where: { userId, productId } });

        if (!cartItem) {
            return res.status(404).json({ message: 'Продукт не найден в корзине' });
        }

        await cartItem.destroy();

        const updatedCart = await getCartForUser(userId); // Получение обновленной корзины
        broadcastCartUpdate(userId, updatedCart); // Отправка обновления через WebSocket

        res.status(200).json({ message: 'Продукт удален из корзины' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка удаления продукта из корзины', error });
    }
};

// Получение корзины пользователя
exports.getUserCart = async (req, res) => {
    const { userId } = req.params;

    try {
        const cartItems = await CartProduct.findAll({
            where: { userId },
            include: [
                {
                    model: Product,
                    attributes: ['name', 'price'], // Только необходимые поля
                    include: [
                        {
                            model: Image,
                            attributes: ['url'], // Получаем ссылки на изображения
                            as: 'images'
                        }
                    ]
                }
            ]
        });

        const formattedCart = cartItems.map((item) => ({
            id: item.id,
            productId: item.productId,
            size: item.size,
            quantity: item.quantity,
            name: item.product.name,
            price: item.product.price,
            imageUrl: item.product.images?.[0]?.url || null // Берем первое изображение или null
        }));

        res.status(200).json(formattedCart);
    } catch (error) {
        console.error('Ошибка получения корзины пользователя:', error);
        res.status(500).json({ message: 'Ошибка извлечения корзины пользователя', error });
    }
};


// Увеличение количества товара в корзине
exports.increaseQuantity = async (req, res) => {
    const { productId } = req.params;
    const userId = req.user.id;

    try {
        const cartItem = await CartProduct.findOne({ where: { userId, productId } });
        if (!cartItem) {
            return res.status(404).json({ message: 'Товар не найден в корзине' });
        }

        cartItem.quantity += 1;
        await cartItem.save();
        res.status(200).json(cartItem);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при увеличении количества товара', error });
    }
};

// Уменьшение количества товара в корзине
exports.decreaseQuantity = async (req, res) => {
    const { productId } = req.params;
    const userId = req.user.id;

    try {
        const cartItem = await CartProduct.findOne({ where: { userId, productId } });
        if (!cartItem) {
            return res.status(404).json({ message: 'Товар не найден в корзине' });
        }

        if (cartItem.quantity > 1) {
            cartItem.quantity -= 1;
            await cartItem.save();
            res.status(200).json(cartItem);
        } else {
            await cartItem.destroy();
            res.status(200).json({ message: 'Товар удален из корзины' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при уменьшении количества товара', error });
    }
};
