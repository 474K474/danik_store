const uuid = require('uuid');
const path = require('path');
const { Product, ProductInfo, Syze, Color, Image } = require('../models/models');
const ApiError = require('../error/ApiError');
const imageController = require('./ImageController');

class ProductController {
    async create(req, res, next) {
        try {
            let { name, price, categoryId, typeId, colorIds, syzeIds, info } = req.body;
            
            const images = req.files ? req.files.img : [];
        
            // Проверка и парсинг colorIds и syzeIds
            if (typeof colorIds === 'string') {
                colorIds = JSON.parse(colorIds);
            }
            if (typeof syzeIds === 'string') {
                syzeIds = JSON.parse(syzeIds);
            }
        
            // Создание продукта
            const product = await Product.create({ name, price, categoryId, typeId });
        
            // Привязка размеров к продукту
            const syzes = await Syze.findAll({ where: { id: syzeIds } });
            if (syzeIds.length && syzes.length !== syzeIds.length) {
                return res.status(404).json({ message: 'Один или несколько размеров не найдены' });
            }
            await product.addSyzes(syzes);
        
            // Привязка цветов к продукту
            const colors = await Color.findAll({ where: { id: colorIds } });
            console.log(colors, colorIds);
            
            if (colorIds.length && colors.length !== colorIds.length) {
                return res.status(404).json({ message: 'Один или несколько цветов не найдены' });
            }
            await product.addColors(colors);
        
            // Обработка изображений            
            if (images) {
                const imgArray = Array.isArray(images) ? images : [images]; // Если одно изображение, сделать массив
                for (const img of imgArray) {
                    await imageController.uploadImage({
                        productId: product.id,
                        file: img,
                    }, next);
                }
            }
        
            // Создание информации о продукте
            if (info) {
                info = JSON.parse(info);
                for (const i of info) {
                    await ProductInfo.create({
                        title: i.title,
                        description: i.description,
                        productId: product.id
                    });
                }
            }
        
            return res.json(product);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }            

    async getAll(req, res) {
        let { categoryId, typeId, colorIds, syzeIds, limit, page } = req.query;
        page = page || 1;
        limit = limit || 9;
        let offset = page * limit - limit;
    
        let where = {};
        let include = [
            {
                model: Syze,
                through: { attributes: [] },
            },
            {
                model: Color,
                through: { attributes: [] },
            },
            {
                model: Image,
                as: 'images',
                attributes: ['url', 'fileName'],
            }
        ];
    
        // Фильтрация по обязательным полям categoryId и typeId
        if (categoryId) where.categoryId = categoryId;
        if (typeId) where.typeId = typeId;
    
        // Фильтрация по цветам
        if (colorIds) {
            if (typeof colorIds === 'string') {
                colorIds = JSON.parse(colorIds);
            }
            include.push({
                model: Color,
                where: { id: colorIds },
                through: { attributes: [] },
            });
        }
    
        // Фильтрация по размерам
        if (syzeIds) {
            if (typeof syzeIds === 'string') {
                syzeIds = JSON.parse(syzeIds);
            }
            include.push({
                model: Syze,
                where: { id: syzeIds },
                through: { attributes: [] },
            });
        }
    
        const products = await Product.findAndCountAll({
            where,
            limit,
            offset,
            include,
        });
    
        return res.json(products);
    }
    

    async getOne(req, res) {
        const { id } = req.params;
        const product = await Product.findOne({
            where: { id },
            include: [
                { model: ProductInfo, as: 'info' },
                { model: Image, as: 'images', attributes: ['id', 'url', 'fileName'] },
                { model: Syze, as: 'syzes', attributes: ['id', 'name'] },
                { model: Color, as: 'colors', attributes: ['id', 'name'] },
            ]
        });
        return res.json(product);
    }
}

module.exports = new ProductController();
