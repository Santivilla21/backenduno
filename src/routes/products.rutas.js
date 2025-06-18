const express = require('express')
const router = express.Router() //esto lo que hace es crear mini servidor.
const controller = require('../controllers/products.controllers')


router.get('/', controller.getAll)
router.get('/:pid', controller.getById)
router.post('/', controller.create)
router.put('/:pid', controller.update)
router.delete('/:pid', controller.delete)
module.exports= router