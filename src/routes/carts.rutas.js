const express =require('express')
const router =express.Router()
const controller = require ('../controllers/carts.controllers')

router.post('/', controller.create)
router.get('/:cid', controller.getById)
router.post('/:cid/product/:pid', controller.addProduct)
module.exports= router