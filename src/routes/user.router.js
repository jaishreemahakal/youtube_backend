import { Router } from "express";
import { registerUser ,loginUser , logoutUser, RefreshAccessToken} from "../controllers/user.controller.js";
// what is router in express?
import {upload} from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router();

router.route("/register").post(upload.fields(
    [
     {  name:"avatar",
        maxCount:1
     },
     {  name:"coverImage",
        maxCount:1
     }   

    ]
),registerUser);

router.route("/login").post(loginUser);


router.route("/logout").post(verifyJWT, logoutUser);

router.route("/refresh").post(RefreshAccessToken);


// what is veriftJWT does?
// It is a middleware that verifies the JWT token in the request
//




export default router;
