import {Router} from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllers/like.controller.js"

const router = Router()

router.route("/toggle-videoLike/:videoId").get( verifyJWT, toggleVideoLike)

router.route("/toggle-commentLike/:commentId").get( verifyJWT, toggleCommentLike)

router.route("/toggle-tweetLike/:tweetId").get( verifyJWT, toggleTweetLike)

router.route("/get-allLiked-videos").get( verifyJWT, getLikedVideos)

export default router;