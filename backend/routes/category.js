const express = require('express');
const router = express.Router();

const {isSignedIn, isAuthenticated, isAdmin} = require('../controllers/auth');
const {getUserById} = require('../controllers/user');
const {getCategoryById, getCategory, createCategory, removeCategory, getAllCategory, updateCategory} = require('../controllers/category');

router.param("userId", getUserById);

router.param("categoryId", getCategoryById);

router.get("/category/:categoryId", getCategory);

router.post('/category/create/:userId', isSignedIn, isAuthenticated, isAdmin, createCategory);

router.get('/categories', getAllCategory);

router.put('/category/:categoryId/:userId', isSignedIn, isAuthenticated, isAdmin, updateCategory);

router.delete('/category/:categoryId/:userId', isSignedIn, isAuthenticated, isAdmin, removeCategory);

module.exports = router;