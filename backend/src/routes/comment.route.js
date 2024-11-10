import Router from "express"
import { addComment, deleteComment, getVideoComments, updateComment } from "../controllers/comment.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/getall-video-comments/:videoId").get(verifyJWT, getVideoComments)

router.route("/add-comment/:videoId").post( verifyJWT, addComment)

router.route("/update-comment/:commentId").patch( verifyJWT, updateComment)

router.route("/delete-comment/:commentId").delete( verifyJWT, deleteComment)

export default router