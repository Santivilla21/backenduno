/* const CartManager = require('../services/CartManager')
const manager = new CartManager('./src/data/carts.json')


module.exports = {
    create: async (req, res) => {
        const result = await manager.createCart()
        res.status(201).json(result)
    },

    getById: async (req, res) => {
        const result = await manager.getCartById(req.params.cid)
        result ? res.json(result) : res.status(404).send('Carrito no encontrado')
    },

    addProduct: async (req, res) => {
        const result = await manager.addProductToCart(req.params.cid, req.params.pid)
        result ? res.json(result) : res.status(404).send('Carrito no encontrado o producto inválido')
    }
} */
const Cart = require('../models/Cart');
const Product = require('../models/Product');


module.exports = {
  create: async (req, res) => {
    try {
      const newCart = new Cart({ products: [] });
      await newCart.save();
      res.status(201).json(newCart);
    } catch (err) {
      res.status(500).json({ error: 'Error al crear el carrito' });
    }
  },

  getById: async (req, res) => {
    try {
      const cart = await Cart.findById(req.params.cid).populate('products.product');
      if (!cart) return res.status(404).send('Carrito no encontrado');
      res.json(cart);
    } catch (err) {
      res.status(400).json({ error: 'ID inválido' });
    }
  },

  addProduct: async (req, res) => {
    try {
      const { cid, pid } = req.params;

      const cart = await Cart.findById(cid);
      if (!cart) return res.status(404).send('Carrito no encontrado');

      const product = await Product.findById(pid);
      if (!product) return res.status(404).send('Producto no encontrado');

      const existingProduct = cart.products.find(p => p.product.equals(pid));
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.products.push({ product: pid, quantity: 1 });
      }

      await cart.save();
      res.json(cart);
    } catch (err) {
      res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
  },

  deleteProductFromCart: async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const cart = await Cart.findById(cid);
      if (!cart) return res.status(404).send('Carrito no encontrado');

      cart.products = cart.products.filter(p => !p.product.equals(pid));
      await cart.save();

      res.json(cart);
    } catch (err) {
      res.status(500).json({ error: 'Error al eliminar producto del carrito' });
    }
  },

  replaceProducts: async (req, res) => {
    try {
      const { cid } = req.params;
      const newProducts = req.body.products; // [{ product: id, quantity: n }, ...]

      // Validar que cada producto exista
      for (const item of newProducts) {
        const productExists = await Product.findById(item.product);
        if (!productExists) {
          return res.status(404).send(`Producto no encontrado: ${item.product}`);
        }
      }

      const cart = await Cart.findByIdAndUpdate(cid, { products: newProducts }, { new: true });
      if (!cart) return res.status(404).send('Carrito no encontrado');

      res.json(cart);
    } catch (err) {
      res.status(500).json({ error: 'Error al actualizar productos del carrito' });
    }
  },

  updateProductQuantity: async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;

      if (quantity <= 0) return res.status(400).send('La cantidad debe ser mayor a cero');

      const cart = await Cart.findById(cid);
      if (!cart) return res.status(404).send('Carrito no encontrado');

      const productInCart = cart.products.find(p => p.product.equals(pid));
      if (!productInCart) return res.status(404).send('Producto no encontrado en el carrito');

      productInCart.quantity = quantity;
      await cart.save();

      res.json(cart);
    } catch (err) {
      res.status(500).json({ error: 'Error al actualizar cantidad del producto' });
    }
  },

  emptyCart: async (req, res) => {
    try {
      const { cid } = req.params;
      const cart = await Cart.findByIdAndUpdate(cid, { products: [] }, { new: true });
      if (!cart) return res.status(404).send('Carrito no encontrado');

      res.json(cart);
    } catch (err) {
      res.status(500).json({ error: 'Error al vaciar el carrito' });
    }
  }
};
