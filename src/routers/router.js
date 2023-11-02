import { Router } from "express";
import { getAllUsers, logIn, joinRoom } from "../controllers/controller.js";

const router = Router();

router.get("/users", getAllUsers);
router.post("/login", logIn);
router.post("/joinroom", joinRoom);

export default router;
