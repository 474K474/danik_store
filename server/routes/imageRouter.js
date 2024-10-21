const Router = require('express')
const router = new Router()
const { upload, uploadImage } = require('../controllers/ImageController')
const checkRole = require('../middleware/checkRoleMiddleware')

// router.post('/upload', upload.single('image'), uploadImage);


module.exports = router