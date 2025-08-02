import { Router } from "express";
import { createUser, getUserById } from "../controllers/userController";

const router = Router();

router.get('/:id', getUserById);
router.post('/create', createUser);

export default router;