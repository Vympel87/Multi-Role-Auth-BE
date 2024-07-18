import express from "express";
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from "../controllers/Products.js"
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/api/products', verifyUser, getProducts);
router.get('/api/products/:id', verifyUser, getProductById);
router.post('/api/products/', verifyUser, createProduct);
router.put('/api/products/:id', verifyUser, updateProduct);
router.delete('/api/products/:id', verifyUser, deleteProduct);

export default router;