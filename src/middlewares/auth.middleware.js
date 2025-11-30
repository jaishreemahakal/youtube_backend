import { asyncHandler } from "../utils/asyncHandlers";
import jwt from "jsonwebtoken";
import { ApiError} from "../utils/apiError.js";
import { User } from "../models/user.model.js";



const verifyJWT=asyncHandler(async(req,res,next)=>{
     try {
        const token=req.cookies?.accessToken || 
        req.header("Authorization")?.replace("Bearer ","")
   
        if(!token){
           throw new ApiError("Unauthorized access, token missing",401);
        }
   
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
   
        const user= await User.findById(decodedToken?._id).select("-password -refreshToken");
   
        if(!user){
           throw new ApiError("Unauthorized access, user not found",401);
     } 
        req.user=user;
        next();
    
    }

     catch (error) {
        throw new ApiError("Unauthorized access, invalid token",401);
        
     }

    



})

export {verifyJWT};