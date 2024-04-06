import { Router } from "express";
import { postPhoto } from "../controllers/settingPhoto.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
const router  = Router();

router.route('/post-photo').post(verifyJWT, postPhoto);

export default router;