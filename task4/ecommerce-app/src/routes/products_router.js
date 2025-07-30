const express = require('express');
const productController = require('../controllers/product_controller');
const authenticated = require('../middlewares/auth_middleware');
const router = express.Router();

router.get('/', productController.getAllProducts);
router.get('/:brand/:page/:limit', productController.getProductsByBrand);
router.post('/', authenticated, productController.addNewProduct);
router.delete('/:id', authenticated, productController.deleteProduct);

module.exports = router;
