const express = require('express')
const fs = require('fs');
const path = require('path');

const app = express()
const PORT = 8080;

const userFilePath = path.join(__dirname, 'products.json')
let products
//obetener usuarios del json
app.get("/products", (req, res) => {

    res.json(products)
})

app.post("/products", (req, res) => {
    const { id, title, description, code, price, status, stock, category, thumbnails } = req.body
    const newProducts = { id , title, description, code, price, status, stock, category, thumbnails }
    products.push(newProducts)
    res.status(201).json(newProducts)
})
app.put("/products/id", (req,res)=>{
    const {id} =req.params
    const { title, description, code, price, status, stock, category, thumbnails }= req.body
    const producto=products.find(products =>products.id === parseInt(id))
    if (!producto)return res.status(404).json({mesaje: "producto not found"})

    producto.id = id
    producto.title = title
    producto.description=description
    producto.code=code
    producto.price=price
    producto.status=status
    producto.stock=stock
    producto.category=category
    producto.thumbnails=thumbnails
    
    res.json(producto)

})

app.delete("/products/:id", (req,res)=>{
    const {id}= req.params
    products =products.filter(products=>products.id !== parseInt(id))
    res.json({mesaje:"producto eliminado"})
})


app.listen(PORT, () => {
    console.log(`servidor ejecutandose en el puerto http://localhost:${PORT}`)
})

