const express = require('express');
const brandController = require('../controllers/brand_controller');
const authenticated = require('../middlewares/auth_middleware');
const router = express.Router();

router.post('/', authenticated, brandController.addNewBrand);
router.put('/:id', authenticated, brandController.updateBrand);
router.get('/', brandController.getAllBrands);
router.delete('/:id', authenticated, brandController.deleteBrand);

module.exports = router;