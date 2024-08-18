import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import {upload} from "../middlewares/multer.middleware.js"
import { deleteVideo, getAllVideos, getVideoById, publishAVideo, togglePublishStatus } from "../controllers/videos.controller.js";

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

router.route("/get-video/:videoId").get( verifyJWT, getVideoById)

router.route("/deleteVideo/:videoId").get(verifyJWT, deleteVideo)

router.route("/toggle-publishStatus/:videoId").get(verifyJWT, togglePublishStatus)

export default router