/* const fs = require('fs').promises;

const {v4: uuidv4} = require ('uuid')

class ProductManager {
    constructor(path){
        this.path = path;
    }

    async getProducts(){
        const data =  await fs.readFile(this.path, 'utf-8')
        return JSON.parse(data)

    }
    async getProductById(id){
        const products = await this.getProducts()
        return products.find(p => p.id === id)

    }

    async addProduct(product){
        const products = await this.getProducts()
        const newProduct = {id: uuidv4(), status: true, ...product}         
        products.push(newProduct);
        await fs.writeFile(this.path, JSON.stringify(products, null, 2))
        return newProduct

    }

async updateProduct(id, update){
    const products = await this.getProducts() 
    const index = products.findIndex( p => p.id === id) 
    if( index === -1) return null; 
    products[index]= {...products[index], ...update, id: products[index].id}
    
    await fs.writeFile(this.path, JSON.stringify(products,null,2)) 
    return products[index]
}

async deleteProduct(id){
    const products = await this.getProducts()
    const updated = products.filter(p => p.id !==id)
    if (products.length === updated.length)return null
    await fs.writeFile(this.path, JSON.stringify(updated, null, 2)) 
    return true 
}


}

module.exports = ProductManager; */
import fs from "fs"; 



class ProductManager {
    static ultId = 0;

    constructor(path) {
        this.products = [];
        this.path = path;

        this.cargarArray(); 
    }

    async cargarArray() {
        try {
            this.products = await this.leerArchivo();
        } catch (error) {
            console.log("Error al inicializar ProductManager");
        }
    }

    async addProduct({ title, description, price, img, code, stock }) {

        if (!title || !description || !price || !img || !code || !stock) {
            console.log("Todos los campos son obligatorios");
            return;
        }

        

        if (this.products.some(item => item.code === code)) {
            console.log("El codigo debe ser unico.. o todos moriremos");
            return;
        }

        const lastProductId = this.products.length > 0 ? this.products[this.products.length - 1].id : 0;
        const nuevoProducto = {
            id: lastProductId + 1,
            title,
            description,
            price,
            img,
            code,
            stock
        };

        this.products.push(nuevoProducto);

        await this.guardarArchivo(this.products);
    }

    async getProducts() {
        try {
            const arrayProductos = await this.leerArchivo(); 
            return arrayProductos;
        } catch (error) {
            console.log("Error al leer el archivo", error); 
        }

    }

    async getProductById(id) {
        try {
            const arrayProductos = await this.leerArchivo();
            const buscado = arrayProductos.find(item => item.id === id); 

            if (!buscado) {
                console.log("producto no encontrado"); 
                return null; 
            } else {
                console.log("Producto encontrado"); 
                return buscado; 
            }
        } catch (error) {
            console.log("Error al buscar por id", error); 
        }
    }

    async leerArchivo() {
        const respuesta = await fs.promises.readFile(this.path, "utf-8");
        const arrayProductos = JSON.parse(respuesta);
        return arrayProductos;
    }

    async guardarArchivo(arrayProductos) {
        await fs.promises.writeFile(this.path, JSON.stringify(arrayProductos, null, 2));
    }

 

    async updateProduct(id, productoActualizado) {
        try {
            const arrayProductos = await this.leerArchivo(); 

            const index = arrayProductos.findIndex( item => item.id === id); 

            if(index !== -1) {
                arrayProductos[index] = {...arrayProductos[index], ...productoActualizado} ; 
                await this.guardarArchivo(arrayProductos); 
                console.log("Producto actualizado"); 
            } else {
                console.log("No se encuentra el producto"); 
            }
        } catch (error) {
            console.log("Tenemos un error al actualizar productos"); 
        }
    }

    async deleteProduct(id) {
        try {
            const arrayProductos = await this.leerArchivo(); 

            const index = arrayProductos.findIndex( item => item.id === id); 

            if(index !== -1) {
                arrayProductos.splice(index, 1); 
                await this.guardarArchivo(arrayProductos); 
                console.log("Producto eliminado"); 
            } else {
                console.log("No se encuentra el producto"); 
            }
        } catch (error) {
            console.log("Tenemos un error al eliminar productos"); 
        }
    }

}

export default ProductManager; 