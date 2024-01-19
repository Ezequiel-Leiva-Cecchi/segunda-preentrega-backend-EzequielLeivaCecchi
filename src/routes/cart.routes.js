import { Router } from "express";
import { CartManager } from "../dao/managerDB/CartMongoManager.js";

const cartRouter = Router();
const cartManager = new CartManager();

// Obtener todos los carritos
cartRouter.get("/", async (req, res) => {
  try {
    const resultado = await cartManager.retrievecarts();

    if (resultado.message === "OK") {
      res.status(200).json(resultado.result);
    } else {
      res.status(404).json({ message: 'No se encontraron carritos' });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los carritos" +error.message });
  }
});

// Obtener un carrito por ID
cartRouter.get("/:cartId", async (req, res) => {
  try {
    const { cartId } = req.params;
    const resultado = await cartManager.getcartById(cartId);

    if (resultado.message === "OK") {
      res.status(200).json(resultado.result);
    } else {
      res.status(404).json(resultado);
    }
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el carrito" +error.message });
  }
});

// Obtener productos en un carrito por ID
cartRouter.get("/:cartId/products", async (req, res) => {
  try {
    const { cartId } = req.params;
    const resultado = await cartManager.getProductsIncart(cartId);

    if (resultado.message === "OK") {
      res.status(200).json(resultado.result);
    } else {
      res.status(404).json(resultado);
    }
  } catch (error) {
    res.status(500).json({ message: "error al obtener los productos del carrito" + error.message });
  }
});

// Agregar productos a un carrito por ID
cartRouter.post("/:cartId/products", async (req, res) => {
  try {
    const { cartId } = req.params;
    const { productId, productQuantity } = req.body;

    const success = await cartManager.addProductsTocart(cartId, productId, productQuantity);

    if (success) {
      res.status(200).json({ message: 'Productos agregados al carrito correctamente' });
    } else {
      res.status(404).json({ message: 'No se pudo agregar productos al carrito' });
    }
  } catch (error) {
    res.status(500).json({ message: "error al agregar productos al carrito" + error.message });
  }
});

// Crear un nuevo carrito
cartRouter.post("/", async (req, res) => {
  try {
    const products = req.body;

    const resultado = await cartManager.createcart(products);

    if (resultado.message === "OK") {
      res.status(201).json(resultado);
    } else {
      res.status(400).json(resultado);
    }
  } catch (error) {
    res.status(500).json({ message: "Error al crear el carrito" + error.message });
  }
});

// Eliminar todos los productos de un carrito por ID
cartRouter.delete("/:cartId/products", async (req, res) => {
  try {
    const { cartId } = req.params;
    const success = await cartManager.removeAllProductsFromCart(cartId);

    if (success) {
      res.status(200).json({ message: 'Productos eliminados del carrito correctamente' });
    } else {
      res.status(404).json({ message: 'No se encontró un carrito con el ID proporcionado' });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar los productos del carrito" + error.message });
  }
});

// Eliminar un carrito por ID
cartRouter.delete("/:cartId", async (req, res) => {
  try {
    const { cartId } = req.params;
    const success = await cartManager.removeCart(cartId);

    if (success) {
      res.status(200).json({ message: 'Carrito eliminado correctamente' });
    } else {
      res.status(404).json({ message: 'No se encontró un carrito con el ID proporcionado' });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el carrito" + error.message });
  }
});

// Eliminar un producto específico de un carrito por ID
cartRouter.delete("/:cartId/products/:productId", async (req, res) => {
  try {
    const { cartId, productId } = req.params;
    const success = await cartManager.removeProductFromCart(cartId, productId);

    if (success) {
      res.status(200).json({ message: 'Producto eliminado del carrito correctamente' });
    } else {
      res.status(404).json({ message: 'No se encontró un carrito o producto con los ID proporcionados' });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el producto del carrito" +error.message });
  }
});

export default cartRouter;
