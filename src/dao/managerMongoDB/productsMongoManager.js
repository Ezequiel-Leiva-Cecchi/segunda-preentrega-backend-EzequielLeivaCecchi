import { ProductsModel } from "../../models/products.model";

export class ProductMongo {
    constructor(nombre, precio, stock, categoria, descripcion, estado) {
        this.nombre = nombre;
        this.precio = precio;
        this.stock = stock;
        this.categoria = categoria;
        this.descripcion = descripcion;
        this.estado = estado;
    }
}

export class GestorProductsMongo {
    async obtenerProductos(limit = 10, page = 1, consulta = '', orden = '') {
        try {
            const [campo, valor] = consulta.split(':');
            const resultadoConsulta = await ProductsModel.paginate({ [campo]: valor }, {
                limit,
                page,
                sort: orden ? { precio: orden } : {}
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
            const producto = await ProductsModel.findOne({ _id: id });
            if (producto)
                return { resultado: "Éxito", productoEncontrado: producto };
            else
                return { resultado: "Error", res: "El producto no existe" };
        } catch (error) {
            return { resultado: "Error", res: "Error al obtener el producto - " + error.message };
        }
    }

    async agregarProducto(nuevoProducto) {
        try {
            let productos = [];
            const validacion = !nuevoProducto.nombre || !nuevoProducto.precio || !nuevoProducto.stock || !nuevoProducto.categoria || !nuevoProducto.descripcion || !nuevoProducto.estado ? false : true;
            if (!validacion)
                return { resultado: "Error", res: "Faltan datos en el producto a ingresar!" };

            const resultadoConsulta = await this.obtenerProductos();
            if (resultadoConsulta.resultado === "Éxito")
                productos = resultadoConsulta.listaProductos.find((e) => e.codigo === nuevoProducto.codigo);
            else
                return { resultado: "Error", res: "No se pudieron obtener los productos" };

            if (productos)
                return { resultado: "Error", res: "Producto con código existente!" };

            const productoAgregado = await ProductsModel.create(nuevoProducto);
            return { resultado: "Éxito", res: "Producto dado de alta correctamente" };
        } catch (error) {
            return { resultado: "Error", res: "Error al agregar el producto - " + error.message };
        }
    }

    async actualizarProducto(id, productoActualizado) {
        try {
            const actualizacion = await ProductsModel.updateOne({ _id: id }, productoActualizado);

            if (actualizacion.modifiedCount > 0)
                return { resultado: "Éxito", res: `Producto con ID ${id} actualizado exitosamente.` };
            return { resultado: "Error", res: `No se encontró un producto con el ID ${id}. No se pudo actualizar.` };
        } catch (error) {
            return { resultado: "Error", res: "Error al momento de actualizar el producto - " + error.message };
        }
    }

    async eliminarProducto(id) {
        try {
            const eliminacion = await ProductsModel.deleteOne({ _id: id });

            if (eliminacion.deletedCount === 0)
                return { resultado: "Error", res: `No se encontró un producto con el ID ${id}. No se pudo eliminar.` };

            return { resultado: "Éxito", res: `Producto con ID ${id} eliminado exitosamente.` };
        } catch (error) {
            return { resultado: "Error", res: "Error al momento de eliminar el producto - " + error.message };
        }
    }
}
