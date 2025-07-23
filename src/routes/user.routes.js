import express, { Router } from "express";
import {
  createUser,
  deleteUser,
  getUserById,
  getUserByName,
  getUsers,
  updateUser,
} from "../controllers/user.controller.js";

const router = Router();

router.post("/create", createUser);
router.get("/all", getUsers);
router.get("/:id", getUserById);
router.get("/search/by-name", getUserByName);
router.delete("/:id", deleteUser);
router.put("/:id", updateUser);

export default router;
