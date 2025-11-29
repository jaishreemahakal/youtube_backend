import {asyncHandler} from '../utils/asyncHandlers.js';
import {ApiError} from '../utils/apiError.js';
import { User } from '../models/user.model.js';


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
  console.log("email:",email);

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
  
  
})

export {registerUser,}