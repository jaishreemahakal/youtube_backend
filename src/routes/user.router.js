import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
// what is router in express?
import {upload} from "../middlewares/multer.middleware.js";

const router=Router();

router.route("/register").post(upload.fields(
    [
     {  name:"avtar",
        maxCount:1
     },
     {  name:"coverImage",
        maxCount:1
     }   

    ]
),registerUser);



export default router;
