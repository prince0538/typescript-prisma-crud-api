import { Router } from "express";
import { createUser, getUsers, getUser, updateUser, deleteUser } from "../controllers/auth.controller";

const router = Router();

router.post('/user', createUser);
router.get('/', getUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;