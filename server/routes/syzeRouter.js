const Router = require('express')
const router = new Router()
const syzeController = require('../controllers/syzeController')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/', checkRole('ADMIN'), syzeController.create)
router.get('/', syzeController.getAll)

module.exports = router