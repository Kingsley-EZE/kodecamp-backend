const express = require('express');
const orderController = require('../controllers/order_controller');
const authenticated = require('../middlewares/auth_middleware');
const router = express.Router();

router.post('/', authenticated, orderController.addNewOrders);
router.get('/', authenticated, orderController.getAllOrders);
router.put('/:id', authenticated, orderController.updateOrderStatus);

module.exports = router;