const productModel = require(`../schema/product_model`);
const mongoose = require('mongoose');
const joi = require("joi");

async function getAllProducts(req, res) {
    try {
        const products = await productModel.find({});
        res.status(200).json({data: products});
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function addNewProduct(req, res) {
    try {
        const { productName, cost, productImages, description, stockStatus, brand } = req.body;

        const ownerId = req.decoded.userId;
        const role = req.decoded.role;

        if (role !== "admin") {
            return res.status(403).json({ message: "Only admins can add products" });
        }

        const schema = joi.object({
            productName: joi.string().required(),
            cost: joi.number().positive().required(),
            productImages: joi.array().items(joi.string()).min(1).required(),
            description: joi.string().required(),
            stockStatus: joi.string().valid("in-stock", "low-stock", "out-of-stock").required(),
            brand: joi.string().required()
        });

        if (!mongoose.Types.ObjectId.isValid(brand)) {
            return res.status(400).json({ message: 'Invalid Brand ID format' });
        }

        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const newProduct = await productModel.create({
            productName,
            ownerId,
            cost,
            productImages,
            description,
            stockStatus,
            brand
        });

        res.status(201).json({ message: "Product added successfully", data: newProduct });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function deleteProduct(req, res) {
    try {
        const productId = req.params.id;
        const ownerId = req.decoded.userId;
        const role = req.decoded.role;

        if (role !== "admin") {
            return res.status(403).json({ message: "Only admins can delete products" });
        }

        const product = await productModel.findOne({ _id: productId, ownerId });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        await productModel.deleteOne({ _id: productId });
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function getProductsByBrand(req, res) {
    try {
        const {brand, page, limit} = req.params;
        if(!brand) {
            return res.status(400).json({ message: "Brand ID is required" });
        }
        const paginationOptions = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
            populate: {
                path: "brand"
            }
        };
        const products = await productModel.paginate({}, paginationOptions);
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products by brand:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    getAllProducts,
    addNewProduct,
    deleteProduct,
    getProductsByBrand
}