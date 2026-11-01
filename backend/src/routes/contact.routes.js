import { Router } from "express";
import { createContact } from "../controllers/contact.controller.js";

const router = Router();

router.post("/create", createContact);

export default router
