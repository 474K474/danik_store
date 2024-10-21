const Router = require('express')
const router = new Router()
const productRouter = require('./productRouter')
const userRouter = require('./userRouter')
const categoryRouter = require('./categoryRouter')
const typeRouter = require('./typeRouter')
const colorRouter = require('./colorRouter')
const syzeRouter = require('./syzeRouter')
const cartRouter = require('./cartRouter')
const imageRouter = require('./imageRouter');


router.use('/user', userRouter)
router.use('/type', typeRouter)
router.use('/category', categoryRouter)
router.use('/color', colorRouter)
router.use('/syze', syzeRouter)
router.use('/product', productRouter)
router.use('/cart', cartRouter)
router.use('/images', imageRouter);


module.exports = router