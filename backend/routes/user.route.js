import express from "express";
import {
  getUsers,
  createUser,
  deleteUser,
  updateUser,
} from "../controllers/user.controller.js";

const userRoutes = express.Router();

userRoutes.get("/", getUsers);
userRoutes.post("/", createUser);
userRoutes.delete("/:id", deleteUser);
userRoutes.patch("/:id", updateUser);

export default userRoutes;
