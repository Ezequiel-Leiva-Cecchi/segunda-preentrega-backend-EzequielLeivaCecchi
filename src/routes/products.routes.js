import { Router } from "express";
import { GestorProductsMongo } from "../dao/managerMongoDB/productsMongoManager.js"; 
import { uploader } from "../utils/multer.js";

const productRouter = Router();
const productsManager = new GestorProductsMongo(); 

// Obtener todos los productos
productRouter.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, query = '', sort = '' } = req.query;
    const resultado = await productsManager.obtenerProductos(limit, page, query, sort);

    if (resultado.resultado === "Éxito") {
      res.status(200).json(resultado);
    } else {
      res.status(400).json({ message: 'Not found' });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los productos" + error.message });
  }
});

// Obtener un producto por ID
productRouter.get("/:pId", async (req, res) => {
  try {
    const { pId } = req.params;
    const resultado = await productsManager.obtenerProductoPorId(pId);

    if (resultado.resultado === "Éxito") {
      res.status(200).json(resultado);
    } else {
      res.status(400).json(resultado);
    }
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el producto" + error.message });
  }
});

// Agregar un nuevo producto
productRouter.post('/', uploader.single('file'), async (req, res) => {
  try {
    const newProduct = req.body;

    const resultado = await productsManager.agregarProducto(newProduct);

    if (resultado.resultado === "Éxito") {
      res.status(201).json(resultado);
    } else {
      res.status(400).json(resultado);
    }
  } catch (error) {
    res.status(500).json({ message: "Error al agregar el producto" + error.message });
  }
});

// Actualizar un producto por ID
productRouter.put('/:pId', async (req, res) => {
  try {
    const { pId } = req.params;
    const updateProd = req.body;

    const resultado = await productsManager.actualizarProducto(pId, updateProd);

    if (resultado.resultado === "Éxito") {
      res.status(200).json(resultado);
    } else {
      res.status(400).json(resultado);
    }
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el producto" + error.message });
  }
});

// Eliminar un producto por ID
productRouter.delete('/:pId', async (req, res) => {
  try {
    const { pId } = req.params;

    const resultado = await productsManager.eliminarProducto(pId);

    if (resultado.resultado === "Éxito") {
      res.status(200).json(resultado);
    } else {
      res.status(404).json(resultado);
    }
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el producto" + error.message });
  }
});

export default productRouter;