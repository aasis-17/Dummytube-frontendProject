import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import {upload} from "../middlewares/multer.middleware.js"
import { deleteVideo, getAllVideos, getVideoById, publishAVideo, togglePublishStatus, updateVideo } from "../controllers/videos.controller.js";

const router = Router()

router.route("/upload-video").post(verifyJWT,
    upload.fields([
        {
            name : "videoFile",
            maxCount : 1
        },
        {
            name : "thumnail",
            maxCount : 1
        }
    ]),
    publishAVideo
)

router.route("/get-allVideos").get( getAllVideos)

router.route("/get-video/:videoId").get(getVideoById)

router.route("/deleteVideo/:videoId").get(verifyJWT, deleteVideo)

router.route("/toggle-publishStatus/:videoId").get(verifyJWT, togglePublishStatus)

router.route("/updateVideo/:videoId").patch(verifyJWT,upload.single("thumnail"), updateVideo)

export default router