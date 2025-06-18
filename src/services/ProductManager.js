const fs = require('fs').promises;

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
module.exports = ProductManager;