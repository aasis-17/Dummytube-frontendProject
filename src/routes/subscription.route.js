import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription } from "../controllers/subscription.controller.js";

 const router = Router()

 router.route("/toggle-subscription/:channelId").get(verifyJWT, toggleSubscription)

 router.route("/channelSubscriber/:channelId").get(verifyJWT, getUserChannelSubscribers)

 router.route("/channelSubscribedTo/:subscriberId").get(verifyJWT, getSubscribedChannels)

 export default router;
