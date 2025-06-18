const express = require('express');
const ProductRouters = require('./routes/products.rutas');
const cartRouters = require ('./routes/carts.rutas');
const path = require ('path')

const app = express();
const PORT = 8080;
app.use(express.json());

app.get('/', (req, res) => {
    res.send('¡Hola, mundo!');
});
app.use('/api/products',ProductRouters)
app.use('/api/carts',cartRouters)

app.listen(PORT, ()=>{
    console.log(`servidor corriendo en http://localhost:${PORT}`)
})
