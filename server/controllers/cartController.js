// Контроллер корзины
exports.addToCart = async (req, res) => {
    const { productId, size } = req.body;
    const userId = req.user.id;

    try {
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: 'Продукт не найден' });
        }

        const existingCartItem = await CartProduct.findOne({
            where: { userId, productId, size }
        });

        if (existingCartItem) {
            return res.status(400).json({ message: 'Товар уже добавлен в корзину с этим размером' });
        }

        const cartItem = await CartProduct.create({ userId, productId, size });
        res.status(201).json(cartItem);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка добавления продукта в корзину', error });
    }
};

exports.removeFromCart = async (req, res) => {
    const { productId } = req.params;
    const userId = req.user.id;

    try {
        const cartItem = await CartProduct.findOne({ where: { userId, productId } });

        if (!cartItem) {
            return res.status(404).json({ message: 'Продукт не найден' });
        }

        await cartItem.destroy();
        res.status(200).json({ message: 'Продукт удален из корзины' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка удаления продукта из корзины', error });
    }
};

exports.getUserCart = async (req, res) => {
    const userId = req.user.id;

    try {
        const cartItems = await CartProduct.findAll({
            where: { userId },
            include: [Product]
        });

        res.status(200).json(cartItems);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка извлечения корзины пользователя', error });
    }
};

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
