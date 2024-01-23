import { productsModel } from "../../models/products.model.js";

export class ProductMongo {
    constructor(id,name, price, stock, category, description, status, code) {
        this.name = name;
        this.price = price;
        this.stock = stock;
        this.category = category;
        this.description = description;
        this.status = status;
        this.code = code
        this.id = id;
    }
}

export class GestorProductsMongo {
    async obtenerProductos(limit = 10, consulta = '', orden = '') {
        console.log('Entro a obtener productos productos')
        try {
            const [campo, valor] = consulta.split(':');
            const resultadoConsulta = await productsModel.paginate({ [campo]: valor }, {
                limit,
                sort: orden ? { price: orden } : {}
            });
            resultadoConsulta.listaProductos = resultadoConsulta.docs;
            delete resultadoConsulta.docs;
            return { resultado: "Éxito", ...resultadoConsulta };
        } catch (error) {
            return { resultado: "Error", res: "No se encontraron productos" };
        }
    }

    async obtenerProductoPorId(id) {
        try {
            const producto = await productsModel.findOne({ _id: id });
            if (producto)
                return { resultado: "Éxito", productoEncontrado: producto };
            else
                return { resultado: "Error", res: "El producto no existe" };
        } catch (error) {
            return { resultado: "Error", res: "Error al obtener el producto - " + error.message };
        }
    }

    async obtenerProductoPorCodigo(code) {
        try {
            const producto = await productsModel.findOne({ code: code });
            if (producto)
                return { resultado: "Exito", productoEncontrado: producto };
            else
                return { resultado: "Error", res: "El producto no existe" };
        } catch (error) {
            return { resultado: "Error", res: "Error al obtener el producto - " + error.message };
        }
    }

    async agregarProducto(nuevoProducto) {
        try {
            console.log("Nuevo Producto:", nuevoProducto);

            // Validación de datos faltantes
            const validacion = nuevoProducto.code || nuevoProducto.name || nuevoProducto.price || nuevoProducto.stock || nuevoProducto.category || nuevoProducto.description || nuevoProducto.status ? false : true;
            if (validacion) {
                return { resultado: "Error", res: "Faltan datos en el producto a ingresar!" };
            }
            // Obtener producto por codigo
            const resultadoConsulta = await this.obtenerProductoPorCodigo(nuevoProducto.code);
            console.log(resultadoConsulta)
            if (resultadoConsulta.resultado === 'Exito') {
                return {resutado: "Error", res:"El codigo de producto ya existe"};  
            }
            // Crear un nuevo producto
            const productoAgregado = await productsModel.create(nuevoProducto);
            return { resultado: "Éxito", res: "Producto dado de alta correctamente" };
        } catch (error) {
            return { resultado: "Error", res: "Error al agregar el producto - " + error.message };
        }
    }
    async actualizarProducto(id, productoActualizado) {
        try {
            const actualizacion = await productsModel.updateOne({ _id: id }, productoActualizado);

            if (actualizacion.modifiedCount > 0)
                return { resultado: "Éxito", res: `Producto con ID ${id} actualizado exitosamente.` };
            return { resultado: "Error", res: `No se encontró un producto con el ID ${id}. No se pudo actualizar.` };
        } catch (error) {
            return { resultado: "Error", res: "Error al momento de actualizar el producto - " + error.message };
        }
    }

    async eliminarProducto(id) {
        try {
            const eliminacion = await productsModel.deleteOne({ _id: id });

            if (eliminacion.deletedCount === 0)
                return { resultado: "Error", res: `No se encontró un producto con el ID ${id}. No se pudo eliminar.` };

            return { resultado: "Éxito", res: `Producto con ID ${id} eliminado exitosamente.` };
        } catch (error) {
            return { resultado: "Error", res: "Error al momento de eliminar el producto - " + error.message };
        }
    }
}
