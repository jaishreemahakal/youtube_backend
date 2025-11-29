import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
// what is router in express?

const router=Router();

router.route("/register").post(registerUser);



export default router;
