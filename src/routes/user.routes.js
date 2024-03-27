import { Router } from "express";
import { loginUser, logout, registerUser } from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route('/register-user').post(registerUser);
router.route("/login").post(loginUser);

router.route('/logout').post(verifyJWT , logout)

export default router;