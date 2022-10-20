const fs = require("fs")

class Contenedor {
    constructor (nombre) {
        this.nombre = nombre;
    }

    async getAll() {
        try {
            const data = await fs.promises.readFile(this.nombre, "utf-8");
            if(data.length>0) {
                const productos = JSON.parse(data);
                return productos;
            }else {
                return [];
            }
        }catch (err) {
            return "No se pudo leer los archivos";
        }
    }

    async save(objProd) {
        try {
            if(fs.existsSync(this.nombre)) {
                const listado = await this.getAll();
                const id = listado.length + 1;

                objProd.id = id;

                listado.push(objProd);
                await fs.promises.writeFile(this.nombre, JSON.stringify(listado));
            }else {
                objProd.id = 1;
                await fs.promises.writeFile(this.nombre, JSON.stringify([objProd]));
            }
            

        }catch (err) {
            return "No se guardo el producto";

        }

    }

    async getById(id) {
        try {
            const productos = await this.getAll();
            const producto = productos.find(element => element.id === id);
            return producto;
        }catch (err) {
            return "El producto no se encontro";
        }

    }

    async deleteById(id) {
        try {
            const productos = await this.getAll();
            const prodActualizados = productos.filter(element => element.id !== id);
            await fs.promises.writeFile(this.nombre, JSON.stringify(prodActualizados));
            return `El producto ${id} se ha eliminado`
        }catch (err) {
            return "No se pudo eliminar el producto"
        }
    }

    async deleteAll() {
        try {
            const vacio = [];
            await fs.promises.writeFile(this.nombre, JSON.stringify(vacio));
            return "Productos Borrados"
        }catch(err) {
            return "No se pudieron borrar los productos"
        }
        
    }
}


const nombreArchivo = new Contenedor('productos.txt')

console.log(nombreArchivo)

const usandoFunciones = async() => {
    await nombreArchivo.save({nombre:"Samsung Tab S7", precio: 120000, imagen: "https://i.postimg.cc/7Z9qb2jG/S7Tab.png" });
    await nombreArchivo.save({nombre:"Samsung A32", precio: 76000, imagen: "https://i.postimg.cc/BbVTLfyb/samsung-A32.png" });
    await nombreArchivo.save({nombre:"Iphone 13 pro", precio: 350000, imagen: "https://i.postimg.cc/65sWPwd3/iphone13.jpg" });
    const listado = await nombreArchivo.getAll();
    console.log(`Los productos son: ${JSON.stringify(listado)}`);
    const productoFiltrado = await nombreArchivo.getById(2);
    console.log(`El producto seleccionado es: ${JSON.stringify(productoFiltrado)}`)
    await nombreArchivo.deleteById(2);
    const listadoRestante = await nombreArchivo.getAll();
    console.log(`Los productos restantes son: ${JSON.stringify(listadoRestante)}`);
    await nombreArchivo.deleteAll()
}

usandoFunciones();








