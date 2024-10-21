const {Syze} = require('../models/models')
const ApiError = require('../error/ApiError');

class SyzeController {
    async create(req, res) {
        const {name} = req.body
        const syze = await Syze.create({name})
        return res.json(syze)
    }

    async getAll(req, res) {
        const syzes = await Syze.findAll()
        return res.json(syzes)
    }

}

module.exports = new SyzeController()