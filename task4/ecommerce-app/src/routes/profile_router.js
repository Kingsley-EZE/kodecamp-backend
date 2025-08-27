const express = require('express');
const profileController = require('../controllers/profile_controller');
const authenticated = require('../middlewares/auth_middleware');
const router = express.Router();

router.get('/', authenticated, profileController.getUserProfile);

module.exports = router;