const orderModel = require("../schema/order_model");
const productModel = require(`../schema/product_model`);
const mongoose = require('mongoose');
const joi = require("joi");

async function addNewOrders(req, res) {
    try {
        const orders = req.body;
        const ownerId = req.decoded.userId;
        const role = req.decoded.role;

        if (role !== "customer") {
            return res.status(403).json({ message: "Only customers can create orders" });
        }

        const schema = joi.array().items(
            joi.object({
                productName: joi.string().required(),
                productId: joi.string().required(),
                quantity: joi.number().positive().required(),
                totalCost: joi.number().positive().required(),
                shippingStatus: joi.string().valid("pending", "shipped", "delivered").required()
            })
        );

        const { error } = schema.validate(orders);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const orderProductIds = orders.map(order => order.productId);

        const invalidFormatIds = orderProductIds.filter(id => !mongoose.Types.ObjectId.isValid(id));

        if (invalidFormatIds.length > 0) {
            return res.status(400).json({
                message: `Invalid Product ID format`,
                invalidIds: invalidFormatIds
            });
        }

        const objectIdProductIds = orderProductIds.map(id => new mongoose.Types.ObjectId(id));

        const products = await productModel.find({ _id: { $in: objectIdProductIds } });
        const productIds = products.map(product => product._id.toString());

        let invalidIds = orderProductIds.filter(id => !productIds.includes(id));
        if (invalidIds.length > 0) {
            return res.status(422).send({ message: `Invalid Product IDs: ${invalidIds.join(", ")} is/are invalid.` });
        }

        orders.forEach(order => {
            order.ownerId = ownerId;
        });
        const newOrders = await orderModel.insertMany(orders);

        const responseMessage = newOrders.length === 1 ? "Order added successfully" : "Orders added successfully";
        res.status(201).json({ message: responseMessage, data: newOrders });
    } catch (error) {
        console.error("Error adding orders:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function getAllOrders(req, res) {
    try {
        const role = req.decoded.role;

        if (role !== "admin") {
            return res.status(403).json({ message: "Only admins can view orders" });
        }

        const orders = await orderModel.find({});
        res.status(200).json({ data: orders });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function updateOrderStatus(req, res) {
    try {
        const orderId = req.params.id;
        const { shippingStatus } = req.body;
        const role = req.decoded.role;

        if (role !== "admin") {
            return res.status(403).json({ message: "Only admins can update orders" });
        }

        const validStatuses = ["pending", "shipped", "delivered"];
        if (!validStatuses.includes(shippingStatus)) {
            return res.status(400).json({ message: "Invalid shipping status" });
        }

        const updatedOrder = await orderModel.findByIdAndUpdate(
            orderId,
            { shippingStatus },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ message: "Order updated successfully", data: updatedOrder });
    } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    addNewOrders,
    getAllOrders,
    updateOrderStatus
};
