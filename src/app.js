import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';


// app is an instance of express
const app = express();

// app.use is a method to configure middleware
//app.use(cors()) is used to enable CORS (Cross-Origin Resource Sharing)
app.use(cors({
    origin: process.env.CORS_ORIGIN ,
    credentials: true
}));

//app.use(express.json()) used to parse incoming JSON requests and puts the parsed data in req.body
app.use(express.json({limit : '16kb'}))

// app.use(express.urlencoded()) is a built-in middleware function in Express. 
// It parses incoming requests with urlencoded payloads and is based on body-parser.
// extended: true allows to parse nested objects
// limit : '16kb' limits the size of the incoming request body to 16 kilobytes
app.use(express.urlencoded({ extended: true ,limit : '16kb'}));

//app.use(express.static ('public')) serves static files such as images, CSS files, and JavaScript files from the 'public' directory
app.use(express.static('public'));

//what is  cookie?
// A cookie is a small piece of data that is stored on the user's computer by the web browser while browsing a website. 
// Cookies are used to remember information about the user, such as login credentials, preferences, and other settings.
// They are sent to the server with every request, allowing the server to identify the user and provide a personalized experience.
//cookie-parser is a middleware that parses cookies attached to the client request object.

app.use(cookieParser());
export { app };