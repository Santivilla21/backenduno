const express = require('express');
const ProductRouters = require('./routes/products.rutas');
const cartRouters = require ('./routes/carts.rutas');
const handlebars = require('express-handlebars')
const viewsRouter = require('./routes/views.rutas');
const path = require('path');
const app = express();


const {createServer}= require("http")
const {Server}=require("socket.io");
const { Socket } = require('dgram');
const { Console } = require('console');


const httpServer= createServer(app)//configuracion de web socket
const io = new Server(httpServer);
io.on("connection", Socket=>{
    console.log("cliente listo")
})
const PORT = 8080;

app.engine('handlebars',handlebars.engine())//configuracion handlebars
app.set('view engine','handlebars')
app.set('views','views');
app.use(express.json());

/* app.get('/',(req,res)=>{
    res.render('home',{
        layout:'main',
        title:'Home'
    })
})
app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', {
        layout: 'main',
        title: 'Productos en Tiempo Real'
    });
}); */
app.use('/', viewsRouter);
app.use('/api/products',ProductRouters)
app.use('/api/carts',cartRouters)

httpServer.listen(PORT,()=>console.log(`servidor activo en el puerto http://localhost:${PORT}`))