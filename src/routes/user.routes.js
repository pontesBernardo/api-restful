import express, { Router } from "express";
import { authMiddleware } from "../auth.js";
import {
  createUser,
  getUsers,
  getUser,
} from "../controllers/user.controller.js";

const router = express.Router();

//Publicas
router.post("/register", createUser);
router.post("/login", getUser);

//Privadas
router.get("/dashboard", authMiddleware, (req, res) => {
  res.json({ message: `Bem vindo ${req.user.email}` });
});

router.get("/users", authMiddleware, getUsers);

export default router;
