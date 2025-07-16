const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    ownerId: {
        type: mongoose.Types.ObjectId,
        ref: 'users',
        required: true
    },
    cost: {
        type: Number,
        required: true
    },
    productImages: {
        type: Array,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    stockStatus: {
        type: String,
        enum: ["in-stock", "low-stock", "out-of-stock"],
        required: true
    }
}, {timestamps: true});

const productModel = mongoose.model("products", productSchema);
module.exports = productModel;