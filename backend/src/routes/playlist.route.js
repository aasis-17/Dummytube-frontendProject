import Router from "express"
import { addVideoToPlaylist, createPlaylist, deletePlaylist, getPlaylistById, getUserPlaylists, removeVideoFromPlaylist, updatePlaylist } from "../controllers/playlist.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/create-playlist").post(verifyJWT, createPlaylist)

router.route("/get-userPlaylist/:userId").get ( verifyJWT, getUserPlaylists )

router.route("/get-playlist/:playlistId").get( verifyJWT, getPlaylistById)

router.route("/addvideo-to-playlist/:playlistId/:videoId").patch( verifyJWT, addVideoToPlaylist)

router.route("/remove-video/:playlistId/:videoId").delete(verifyJWT, removeVideoFromPlaylist)

router.route("/update-playlist/:playlistId").patch( verifyJWT, updatePlaylist)

router.route("/delete-playlist/:playlistId").delete( verifyJWT, deletePlaylist)

export default router