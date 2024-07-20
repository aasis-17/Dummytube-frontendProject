import { Router } from "express";
import { changeOldPassword, getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails, updateAvatar, updateCoverImage } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()
//register route
router.route("/register").post(
    upload.fields([
        {
            name : "avatar",
            maxCount : 1
        },
        {
            name : "coverImage",
            maxCount : 1
        }
    ]),
    registerUser)
//login route
router.route("/login").post(loginUser)

//logout route
router.route("/logout").post( verifyJWT, logoutUser)

//refresh accesstoken route
router.route("/refreshed-accesstoken").post(verifyJWT, refreshAccessToken)

//password change
router.route("/change-password").post(verifyJWT, changeOldPassword)

//account details change

router.route("/update-details").post(verifyJWT, updateAccountDetails)

//get current user
router.route("/current-user").post(verifyJWT, getCurrentUser)

//avatar change
router.route("/update-avatar").post(
    upload.single("avatar"),
     verifyJWT,
      updateAvatar)

//cover image change

router.route("/update-coverImage").post(
    upload.single("coverImage"),
     verifyJWT,
     updateCoverImage)

//get user
router.route("/getcurrent-user").post(verifyJWT, getCurrentUser)
export default router;