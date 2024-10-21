const express = require('express');
const multer = require('multer');
const uuid = require('uuid');
const path = require('path');
const { Product, Image } = require('../models/models');
const ApiError = require('../error/ApiError');


const uploadImage = async ({ productId, file }, next) => {
  try {
    console.log(file);

    const fileExtension = path.extname(file.name); // Получаем расширение файла

    // Генерируем уникальное имя файла
    const uniqueFileName = `${uuid.v4()}${fileExtension}`;

    // Устанавливаем путь для сохранения файла
    const filePath = path.resolve(__dirname, '..', 'static', uniqueFileName);

    // Сохраняем файл на диск
    file.mv(filePath, (err) => {
      if (err) {
        return next(ApiError.badRequest('Ошибка при загрузке файла'));
      }
    });

    // Формируем URL для сохраненного файла
    const url = `/static/${uniqueFileName}`;

    // Сохраняем информацию об изображении в базе данных
    const image = await Image.create({ url, fileName: uniqueFileName, productId });

  } catch (error) {
    throw new Error(error.message);
  }
};


module.exports = { uploadImage };
