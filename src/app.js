import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';


// app is an instance of express
const app = express();

// app.use is a method to configure middleware
//cors is similar to a middleware
//app.use(cors()) is used to enable CORS (Cross-Origin Resource Sharing)
app.use(cors({
    origin: process.env.CORS_ORIGIN ,
    credentials: true
}));

//app.use(express.json()) used to parse incoming JSON requests and puts the parsed data in req.body
// limit : '16kb' limits the size of the incoming request body to 16 kilobytes
app.use(express.json({limit : '16kb'}))

// app.use(express.urlencoded()) is a built-in middleware function in Express. 
// It parses incoming requests with urlencoded payloads and is based on body-parser.
// extended: true allows to parse nested objects
// limit : '16kb' limits the size of the incoming request body to 16 kilobytes
app.use(express.urlencoded({ extended: true ,limit : '16kb'}));

//app.use(express.static ('public')) serves static files such as images, CSS files, and 
// JavaScript files from the 'public' directory
app.use(express.static('public'));

//what is  cookie?
// A cookie is a small piece of data that is stored on the user's computer by the web browser while browsing a website. 
// Cookies are used to remember information about the user, such as login credentials, preferences, and other settings.
// They are sent to the server with every request, allowing the server to identify the user and provide a personalized experience.
//cookie-parser is a middleware that parses cookies attached to the client request object.

app.use(cookieParser());


//routes import
import userRouter from './routes/user.router.js'
import healthcheckRouter from "./routes/healthcheck.router.js"
import tweetRouter from "./routes/tweet.router.js"
import subscriptionRouter from "./routes/subscription.router.js"
import videoRouter from "./routes/video.router.js"
import commentRouter from "./routes/comment.router.js"
import likeRouter from "./routes/like.router.js"
import playlistRouter from "./routes/playlist.router.js"
import dashboardRouter from "./routes/dashboard.router.js"

//routes declaration
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/dashboard", dashboardRouter)



export { app }