const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/:id', userController.getUserProfile);
router.post('/register', userController.registerUser);
router.get('/search', userController.searchUsers);

module.exports = router;
