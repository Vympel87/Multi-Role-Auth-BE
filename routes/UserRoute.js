import express from "express";
import {
    getUsers,
    getUsersById,
    createUsers,
    updateUsers,
    deleteUsers
} from "../controllers/Users.js"
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/api/users', verifyUser, adminOnly, getUsers);
router.get('/api/users/:id', verifyUser, adminOnly, getUsersById);
router.post('/api/users/', verifyUser, adminOnly, createUsers);
router.put('/api/users/:id', verifyUser, adminOnly, updateUsers);
router.delete('/api/users/:id', verifyUser, adminOnly, deleteUsers);

export default router;