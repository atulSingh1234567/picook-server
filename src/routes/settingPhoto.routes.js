import { Router } from "express";
import { fetchPhotos, postPhoto } from "../controllers/settingPhoto.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
const router  = Router();

router.route('/post-photo').post(verifyJWT, upload.single('file'), postPhoto);
router.route('/fetch-photo').post(fetchPhotos)
export default router;