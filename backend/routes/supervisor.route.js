import express from "express";
import {
  createSupervisor,
  getSupervisors,
  getSupervisorById,
  updateSupervisor,
  deleteSupervisor,
} from "../controllers/supervisor.controller.js";

const supervisorRoutes = express.Router();

supervisorRoutes.post("/", createSupervisor);
supervisorRoutes.get("/", getSupervisors);
supervisorRoutes.get("/:id", getSupervisorById);
supervisorRoutes.put("/:id", updateSupervisor);
supervisorRoutes.delete("/:id", deleteSupervisor);

export default supervisorRoutes;
