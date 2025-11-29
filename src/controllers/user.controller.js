import {asyncHandler} from '../utils/asyncHandlers.js';
import {ApiError} from '../utils/apiError.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/apiResponse.js';
import bcrypt from 'bcrypt';


const registerUser = asyncHandler(async (req, res) => {
  //gets users details from frontend
  //vaildation 
  //cheks id users already exists :username,email
  //checks of images and avatars
  //upload it to the clodinary
  //create user objec ,create entry in db
  //remove password and refreshtoken from the response
  //checks for user creation is yes
  //return response to frontend
  //else throw error 

  //destructuring user details from req.body
  const { fullName,email,username,password}=req.body;
  
  

  //vaildation
  if([fullName,email,username,password].some((field)=>field?.trim()===""))
  {
    throw new ApiError("All fields are required",400);
  }
  //check if user already exists

  const existedUser= await User.findOne({
    $or:[{email},{username}]
  })
  if(existedUser){
    throw new ApiError("User already exists with this email or username",409);
    
  }

  //check for images and avatars

  const avtarlocalpath=req.files?.avatar[0]?.path;
  const coverImagelocalpath=req.files?.coverImage[0]?.path;

  if(!avtarlocalpath){
    throw new ApiError("Avatar is required",400);
  }

  //upload it to the clodinary
  const avatar=await uploadOnCloudinary(avtarlocalpath);
  const coverImage=await uploadOnCloudinary(coverImagelocalpath);

  if(!avatar){
    throw new ApiError("Error while uploading avatar image",500);
  }


  //create user object ,create entry in db
  const user= await User.create(
    {
      fullName,
      email,
      username:username.toLowerCase(),
      password, 
      avatar:avatar?.url, // cloudinary url
      coverimage:coverImage?.url || ""  // cloudinary url
    }

  )

  //remove password and refreshtoken from the response

  const createduser= await User.findById(user._id).select("-password -refreshToken");
   if(!createduser){
    throw new ApiError("Error while registering user",500);
   }
    //return response to frontend
    return res.status(201).json(
      new ApiResponse(200,createduser,"User registered successfully")

      )
    
})

export {registerUser,}