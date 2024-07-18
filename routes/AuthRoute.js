import express from "express";
import {Login, logOut, GetUserLogin} from "../controllers/Auth.js"

const router = express.Router();

router.get('/api/getUserLogin', GetUserLogin);
router.post('/api/login', Login);
router.delete('/api/logout', logOut);

export default router;