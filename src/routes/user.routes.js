import { Router } from "express";
import { changePassword, editProfile, fetchUser, loginUser, registerUser, setCookie } from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route('/register-user').post(registerUser);
router.route("/login").post(loginUser);
router.route("/").get(setCookie);



router.route('/edit-profile').post(verifyJWT , editProfile);
router.route('/change-password').post(verifyJWT, changePassword);
router.route('/fetch-user').post(verifyJWT , fetchUser);

export default router;