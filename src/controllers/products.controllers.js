/* const ProductManager = require('../services/ProductManager')
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

} */
const Product = require('../models/Product');

module.exports = {
  // GET /api/products con paginación, filtrado y ordenamiento
  getAll: async (req, res) => {
    try {
      const {
        limit = 10,
        page = 1,
        sort,
        query
      } = req.query;

      const filter = {};
      if (query) {
        if (query === 'true' || query === 'false') {
          filter.status = query === 'true';
        } else {
          filter.category = query;
        }
      }

      const options = {
        limit: parseInt(limit),
        page: parseInt(page),
        sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : undefined,
        lean: true
      };

      const result = await Product.paginate(filter, options);

      const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
      
      res.json({
        status: "success",
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage ? `${baseUrl}?page=${result.prevPage}` : null,
        nextLink: result.hasNextPage ? `${baseUrl}?page=${result.nextPage}` : null
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ status: "error", message: "Error al obtener productos paginados" });
    }
  },

  // GET /api/products/:pid
  getById: async (req, res) => {
    try {
      const product = await Product.findById(req.params.pid);
      if (!product) return res.status(404).send('Producto no encontrado');
      res.json(product);
    } catch (err) {
      res.status(400).json({ error: 'ID inválido' });
    }
  },

  // POST /api/products
  create: async (req, res) => {
    try {
      const newProduct = new Product(req.body);
      await newProduct.save();
      res.status(201).json(newProduct);
    } catch (err) {
      res.status(400).json({ error: 'Error al crear producto', details: err.message });
    }
  },

  // PUT /api/products/:pid
  update: async (req, res) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.pid,
        req.body,
        { new: true }
      );
      if (!updatedProduct) return res.status(404).send('Producto no encontrado');
      res.json(updatedProduct);
    } catch (err) {
      res.status(400).json({ error: 'Error al actualizar producto' });
    }
  },

  // DELETE /api/products/:pid
  delete: async (req, res) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(req.params.pid);
      if (!deletedProduct) return res.status(404).send('Producto no encontrado');
      res.json(deletedProduct);
    } catch (err) {
      res.status(400).json({ error: 'Error al eliminar producto' });
    }
  }
};
