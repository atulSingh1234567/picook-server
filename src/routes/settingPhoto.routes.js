import { Router } from "express";
import { fetchPhotos, postPhoto,dbPhotos, savePhoto, sendSavedPhoto } from "../controllers/settingPhoto.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
const router  = Router();

router.route('/post-photo').post(verifyJWT, upload.single('file'), postPhoto);
router.route('/fetch-photo').post(fetchPhotos)
router.route('/send-photo').get(dbPhotos)
router.route('/save-photo').post(verifyJWT , savePhoto);
router.route('/send-saved-photo').post(sendSavedPhoto);

export default router;