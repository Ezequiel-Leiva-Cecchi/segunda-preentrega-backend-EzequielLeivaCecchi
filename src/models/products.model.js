import mongoose from "mongoose";

const productsCollection = "products";

const productsSchema = new mongoose.Schema({
    "name": String,
    "price": Number,
    "stock": String,
    "category": {
        type: String,
        enum: ["Samsung", "iPhone"],
        default: "Samsung"
    },
    "descripcion": String,
    "status": Boolean
});

export const productsModel = mongoose.model(productsCollection, productsSchema);