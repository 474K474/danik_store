const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true,},
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
})

const Cart = sequelize.define('cart', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const CartProduct = sequelize.define('cart_product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const Product = sequelize.define('product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    price: {type: DataTypes.INTEGER, allowNull: false}
})

const Type = sequelize.define('type', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
})

const Category = sequelize.define('category', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
})

const Color = sequelize.define('color', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
})

const Syze = sequelize.define('syze', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
})

const Image = sequelize.define('image', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    fileName: { type: DataTypes.STRING, allowNull: false },
    url: {type: DataTypes.STRING, unique: true, allowNull: false},
    productId: { type: DataTypes.INTEGER, allowNull: false },
});

const ProductColor = sequelize.define('product_color', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
});

const ProductSyze = sequelize.define('product_syze', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
});

const ProductInfo = sequelize.define('product_info', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING, allowNull: false},
})


// Ассоциации многие ко многим для цветов и размеров
Product.belongsToMany(Color, { through: ProductColor });
Color.belongsToMany(Product, { through: ProductColor });

Product.belongsToMany(Syze, { through: ProductSyze });
Syze.belongsToMany(Product, { through: ProductSyze });


Product.hasMany(Image, { foreignKey: 'productId', as: 'images' });
Image.belongsTo(Product, { foreignKey: 'productId', as: 'product' });


// Оставшиеся ассоциации
User.hasOne(Cart);
Cart.belongsTo(User);

Cart.hasMany(CartProduct);
CartProduct.belongsTo(Cart);

Type.hasMany(Product);
Product.belongsTo(Type);

Category.hasMany(Product);
Product.belongsTo(Category);

Product.hasMany(CartProduct);
CartProduct.belongsTo(Product);

Product.hasMany(ProductInfo, {as: 'info'});
ProductInfo.belongsTo(Product);


module.exports = {
    User,
    Cart,
    CartProduct,
    Product,
    Type,
    Category,
    Color,
    Syze,
    ProductInfo,
    Image
}


  