const ProductManager = require('../services/ProductManager')
const manager = new ProductManager('./src/data/products.json')


module.exports ={
    getAll: async (req, res)=>{
        const result = await manager.getProducts()
        res.json(result)

    },

    getById: async (req, res)=>{ 
        const result = await manager.getProductsById(req.params.id) 
        result ? res.json(result): res.status(404).send('producto no encontrado')
       
    },
    create: async(req,res)=>{
        const result = await manager.addProduct(req.body)
        result ? res.status(201).json(result) : res.status(400).send('Error al crear producto')
    },
    update: async (req, res) =>{
        const result = await manager.updateProduct(req.params.id, req.body)
        result ? res.json(result): res.status(404).send('producto no encontrado')
    },
    delete: async (req, res) =>{
        const result = await manager.deleteProduct(req.params.id)
        result ? res.json(result): res.status(404).send('producto no encontrado')
    }

}