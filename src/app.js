import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser"


const app = express()

// we configure middlewares

app.use(cors(
    {
        origin : process.env.CORS_ORIGIN,
        credentials : true
    }
))

app.use(express.json())//{limit : "16kb"}))

app.use(express.urlencoded({
    extended : true,
   // limit : "16kb"
}))

app.use(express.static("public"))

app.use(cookieParser())

//import route

import userRouter from "./routes/user.route.js"
import subscriptionRoute from "./routes/subscription.route.js"
import videoRoute from "./routes/video.route.js"
import userTweet from "./routes/tweet.route.js"
import userPlaylist from "./routes/playlist.route.js"
import userLike from "./routes/like.route.js"
import commentRoute from "./routes/comment.route.js"
import dashboardRoute from "./routes/dashboard.route.js"

app.use("/api/v1/users", userRouter)

app.use("/api/v1/subscription", subscriptionRoute)

app.use("/api/v1/video", videoRoute)

app.use("/api/v1/tweet", userTweet)

app.use("/api/v1/playlist", userPlaylist)

app.use("/api/v1/like", userLike)

app.use("/api/v1/comment", commentRoute)

app.use("/api/v1/dashboard", dashboardRoute)

export {app}
