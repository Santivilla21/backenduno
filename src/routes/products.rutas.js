import express from "express";
import ProductModel from "../models/Product.js"; 

const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const products = await ProductModel.find();

    if (limit) {
      return res.json(products.slice(0, limit));
    }
    res.json(products);
  } catch (error) {
    res.status(500).send("Error interno del servidor");
  }
});


router.get("/:pid", async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.pid);
    if (!product) return res.status(404).send("Producto no encontrado");
    res.json(product);
  } catch (error) {
    res.status(500).send("Error al buscar el producto");
  }
});


router.post("/", async (req, res) => {
  try {
    const nuevoProducto = new ProductModel(req.body);
    await nuevoProducto.save();
    res.status(201).send("Producto agregado exitosamente");
  } catch (error) {
    res.status(500).send("Error al agregar el producto");
  }
});


router.delete("/:pid", async (req, res) => {
  try {
    await ProductModel.findByIdAndDelete(req.params.pid);
    res.send("Producto eliminado");
  } catch (error) {
    res.status(500).send("Error al querer borrar un producto");
  }
});

export default router;
