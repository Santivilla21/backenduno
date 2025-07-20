import express from 'express';
import ProductRouters from './routes/products.rutas.js';
import cartRouters from './routes/carts.rutas.js';
import handlebars from 'express-handlebars';
import viewsRouter from './routes/views.rutas.js';
import path from 'path';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import ProductModel from './models/Product.js'; 

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const PORT = 8080;

// __dirname 
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



// Handlebars 
app.engine('handlebars', handlebars.engine({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
}));

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB
mongoose.connect('mongodb+srv://patisanti123:coderhouse@cluster0.otmadey.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error(' Error al conectar ', err));

// WebSocket
io.on("connection", (socket) => {
  console.log(" Cliente conectado");

  socket.on("nuevoProducto", async (producto) => {
    const nuevoProducto = new ProductModel(producto);
    await nuevoProducto.save();

    const productos = await ProductModel.find().lean();
    io.emit("actualizarProductos", productos);
  });
});

// Rutas
app.use('/', viewsRouter);
app.use('/api/products', ProductRouters);
app.use('/api/carts', cartRouters);


httpServer.listen(PORT, () => console.log(` Servidor activo en http://localhost:${PORT}`));
