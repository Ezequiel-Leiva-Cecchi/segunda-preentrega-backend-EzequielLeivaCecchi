import mongoose from "mongoose";
import cartsModel from "../../models/carts.model.js";

export class CartProduct {
    constructor(productId, productQuantity) {
        this.productId = productId;
        this.productQuantity = productQuantity;
    }
}

export class cartsManager {
    #carts;

    constructor() {
        this.#carts = [];
    }

    async retrievecarts() {
        try {
            const fetchedCarts = await cartsModel.find().lean();
            return { message: "OK", result: fetchedCarts };
        } catch (error) {
            return { message: "ERROR", result: "No hay carritos disponibles" };
        }
    }

    async getcartById(cartId) {
        try {
            const cart = await cartsModel.findOne({ _id: cartId });
            if (cart) {
                return { message: "OK", result: cart };
            } else {
                return { message: "ERROR", result: "El carrito no existe" };
            }
        } catch (error) {
            return { message: "ERROR", result: "Error al obtener el carrito - " + error.message };
        }
    }

    async getProductsIncart(cartId) {
        try {
            const cart = await cartsModel.findOne({ _id: cartId }).populate('products.product');
            if (cart) {
                return { message: "OK", result: cart.products };
            } else {
                return { message: "ERROR", result: "El carrito no existe o no tiene productos" };
            }
        } catch (error) {
            return { message: "ERROR", result: "Error al obtener los productos del carrito - " + error.message };
        }
    }

    async addProductsTocart(cartId, productId, productQuantity) {
        try {
            const cart = await cartsModel.findOne({ _id: cartId });
            if (cart) {
                const existingProduct = cart.products.find(product => product.product.toString() === productId);
                if (existingProduct) {
                    existingProduct.quantity += productQuantity;
                } else {
                    cart.products.push({ product: productId, quantity: productQuantity });
                }
                await cart.save();
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    }

    async createcart(products) {
        try {
            const createdCart = await cartsModel.create(products);
            return { message: "OK", result: "Carrito creado exitosamente" };
        } catch (error) {
            return { message: "ERROR", result: "Error al crear el carrito - " + error.message };
        }
    }

    async removeAllProductsFromCart(cartId) {
        try {
            const deleted = await cartsModel.updateOne({ _id: cartId }, { products: [] });
            if (deleted.modifiedCount > 0) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async removeProductFromCart(cartId, productId) {
        try {
            const result = await cartsModel.updateOne({ _id: cartId }, {
                $pull: { products: { product: new mongoose.Types.ObjectId(productId) } }
            });
            if (result.modifiedCount > 0) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error(error);
            return false;
        }
    }
}
