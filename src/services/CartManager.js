import fs from "fs"; 


class CartManager {
    constructor(path) {
        this.path = path;
        this.carts = [];
        this.ultId = 0;
        this.cargarCarritos();
    }

    async cargarCarritos() {
        try {
            const data = await fs.promises.readFile(this.path, "utf-8");
            this.carts = JSON.parse(data);
            if (this.carts.length > 0) {
                //Verifico si hay por lo menos algun elemento y voy a calcular el ultimo id: 
                this.ultId = Math.max(...this.carts.map(cart => cart.id));
                //Utilizo el método map para crear un nuevo array que solo tenga los ids y con Math.Max obtengo el mayor, guardandolo en la propiedad ultId. 
            }
        } catch (error) {
            console.log("Error al cargar el carrito");
            await this.guardarCarritos();
        }
    }

    async guardarCarritos() {
        await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    }

    //metodo para crear un carrito: 

    async crearCarrito() {
        const nuevoCarrito = {
            id: ++this.ultId,
            products: []
        };

       
        this.carts.push(nuevoCarrito);

        //Guardar el array en el archivo: 
        await this.guardarCarritos();
        return nuevoCarrito;
    }

    async getCarritoById(carritoId) {
        try {
            const carritoBuscado = this.carts.find(carrito => carrito.id === carritoId);

            if (!carritoBuscado) {
                throw new Error("No existe un carrito con ese id");
            }

            return carritoBuscado;

        } catch (error) {
            console.log("Error al obtener el carrito por id, vamos a morir");
            throw error;
        }
    }

    async agregarProductoAlCarrito(carritoId, productoId, quantity = 1) {
        const carrito = await this.getCarritoById(carritoId);
        const existeProducto = carrito.products.find(p => p.product === productoId);
        //De esta forma chequeo si el producto que estoy recibiendo para agregar al carrito ya esta presente en el. Si existe modifico la cantidad, si no existe lo agrego. 

        if (existeProducto) {
            existeProducto.quantity += quantity;
        } else {
            carrito.products.push({ product: productoId, quantity });
        }

        //Como aca modifique el carrito, ahora tengo que guardar en el archivo: 
        await this.guardarCarritos();
        return carrito;
    }

}

export default CartManager; 