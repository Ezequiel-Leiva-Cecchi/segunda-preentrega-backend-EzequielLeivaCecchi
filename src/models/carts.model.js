import mongoose from "mongoose";

const cartColletion = "cart"

const cartSchema = new mongoose.Schema({
    products:{
        type: [
            {
                product: {
                    type: mongoose.Schema.ObjectId,
                    red: true,
                    ref: 'products'
                },
                quantity:Number
            }
        ],
        default:[]
    }
})

const cartsModel = mongoose.model(cartColletion,cartSchema)

export default cartsModel;