const express = require('express');
const router = express.Router();

const productController = require('../controllers/product_controller');

//Products API Routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getSingleProduct);
router.post('/', productController.createNewProduct);
router.patch('/:id', productController.updateProduct);
router.patch('/:id/:status', productController.updateProductStockStatus);
router.delete('/:id', productController.deleteProduct);

module.exports = router;