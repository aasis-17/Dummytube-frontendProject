import { Router } from "express";
import { changeOldPassword, deactivateAccount, getCurrentUser, getUserChannelProfile, getWatchHistory, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails, updateAvatar, updateCoverImage } from "../controllers/user.controller.js";
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
router.route("/refreshed-accesstoken").post(refreshAccessToken)

//password change
router.route("/change-password").post(verifyJWT, changeOldPassword)

//account details change

router.route("/update-details").patch(verifyJWT, updateAccountDetails)

//get current user
router.route("/current-user").get(verifyJWT, getCurrentUser)

//avatar change
router.route("/update-avatar").patch(
    verifyJWT,
    upload.single("avatar"),
    updateAvatar)

//cover image change

router.route("/update-coverImage").patch(
    verifyJWT,
    upload.single("coverImage"),
    updateCoverImage)

//get user channel profile

router.route("/channel-profile/:channelId").get( getUserChannelProfile)

//get user watch history

router.route("/watch-history").get(verifyJWT, getWatchHistory)

router.route("/deactivate-account").delete(verifyJWT, deactivateAccount)

export default router;