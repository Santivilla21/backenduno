import express from "express";
import CartModel from "../models/Cart.js";
import ProductModel from "../models/Product.js"; // Necesario para validar productos

const router = express.Router();

// Crear un nuevo carrito
router.post("/", async (req, res) => {
  try {
    const nuevoCarrito = new CartModel({ products: [] });
    await nuevoCarrito.save();
    res.status(201).json(nuevoCarrito);
  } catch (error) {
    res.status(500).send("Error al crear el carrito");
  }
});

// Agregar un producto a un carrito
router.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const quantity = req.body.quantity || 1;

  try {
    const cart = await CartModel.findById(cid);
    if (!cart) return res.status(404).send("Carrito no encontrado");

    const product = await ProductModel.findById(pid);
    if (!product) return res.status(404).send("Producto no encontrado");

    const index = cart.products.findIndex(p => p.product.equals(pid));

    if (index !== -1) {
      // Ya existe el producto, actualizar cantidad
      cart.products[index].quantity += quantity;
    } else {
      // Nuevo producto
      cart.products.push({ product: pid, quantity });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).send("Error al agregar el producto al carrito");
  }
});

export default router;
