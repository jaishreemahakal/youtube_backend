import {asyncHandler} from '../utils/asyncHandlers.js';
import {ApiError} from '../utils/apiError.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/apiResponse.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { subscription } from '../models/subscription.model.js';
import mongoose from 'mongoose';

const generateAccessandRefreshTokens= async(userId)=>{
  try {
    const user=await User.findById(userId);
    const accessToken=user.generateAccessToken()
    const refreshToken=user.generateRefreshToken() // Fixed: correct method name
    
    //save refresh token in database
    user.refreshToken=refreshToken;
    await user.save({validateBeforeSave:false});
    //return tokens
    return {accessToken,refreshToken};
    
  } catch (error) {
    throw new ApiError("Error while generating tokens",500);
    
  }
}


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

//login user controller
const loginUser=asyncHandler(async(req,res)=>{
   //req body->data
   // username, email based login 
   //find a user by username or email
   //password check
   //refresh and access token generation
   //send cookies and response

   //destructuring user details from req.body
   const {username ,email, password}=req.body

   //vaildation
   if(!(username || email)){
    throw new ApiError("Username and password are required",400);
   }
   
   //find a user by username or email
   const user= await User.findOne({   //database is alwsys in another conteninet
    $or:[{email},{username}]
   })

   if(!user){
    throw new ApiError("Invalid username or email",404);
   }

  const isPasswordValid = await user.isPasswordCorrect(password)

  if(!isPasswordValid){
    throw new ApiError("Invalid password",401);

  }
  //refresh and access token generation
  const {accessToken,refreshToken}= 
  await generateAccessandRefreshTokens (user._id);

  const loggedInUser= await User.findById(user._id)
  .select("-password -refreshToken");

  //send cookies and response
   const Options={
    httpOnly:true,
    secure:true
   }
 
   //send res
   return res.status(200)
   .cookie("refreshToken",refreshToken,Options)
   .cookie("accessToken",accessToken,Options)
   .json(
    new ApiResponse(
      200,
      {
        user:loggedInUser,
        accessToken,refreshToken
      }
      ,
      "User Logged in successfully"
    )
   )





})

//logout user controller
const logoutUser=asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset:{
        refreshToken: 1
    }
  }

   )
 
    const Options={
    httpOnly:true,
    secure:true
   }

   return res.status(200)
   .clearCookie("refreshToken",Options)
   .clearCookie("accessToken",Options)
   .json(
    new ApiResponse(
      200,
      null,
      "User logged out successfully"
    )
   ) 



})

const RefreshAccessToken=asyncHandler(async(req,res)=>{
  //extract refresh token from cookies or headers
  const incomingRefrshToken=req.cookies?.refreshToken || req.body?.refreshToken
  if(!incomingRefrshToken){
    throw new ApiError("unauthorised request",401);

  }
  //verify refresh token
  const decodedToken=jwt.verify
  ( incomingRefrshToken,
    process.env.REFRESH_TOKEN_SECRET
  )
 

  //compare the refresh token with the one in database
  const user= await User.findById(decodedToken?._id);
  if(!user){
    throw new ApiError("unauthorised request, user not found",401);
  }

  if(user?.refreshToken !== incomingRefrshToken){
    throw new ApiError("unauthorised request, invalid refresh token",401);
  }
  
  const options={
    httpOnly:true,
    secure:true
  }
  //genreate new access and refresh tokesn
  const {accessToken,NewrefreshToken}=await 
  generateAccessandRefreshTokens(user._id)

  //send response including cookies
  return res.status(200)
  .cookie("accessToken",accessToken.options)
  .cookie("refreshToken",NewrefreshToken,options)
  .json( 
    new ApiResponse(200,
    {
      accessToken,NewrefreshToken
    },
    "Access token refreshed successfully"
  )
)
})


const changeCurrentPassword=asyncHandler(async(req,res)=>{
  //destructure old and new password from req.body
  const{ oldPassword,newPassword}=req.body;

  //get user id from req.user
  const user=await User.findById(req.user?._id)

  const isPasswordValid = await user.isPasswordCorrect(oldPassword);
  if(!isPasswordValid){
    throw new ApiError("Old password is incorrect",400);
  }
  //update password
  user.password=newPassword;
  await user.save({validateBeforeSave:true});
  return res.status(200).json(
    new ApiResponse(200,null,"Password changed successfully")
  );





}

)


const updateAccountDetails=asyncHandler(async(req,res)=>{ 
  const {fullName,email}=req.body

  if(!username || !email){
    throw new ApiError("Username and email are required",400)
  }
  //find and update user details
  const user=await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
        fullNmame:fullName,
        email:email
      }
    },
    {
      new:true,
    }
  ).select("-password")
  return res.status(200).json(
    new ApiResponse(200,user,"Account details updated successfully")
  )


})

const updateUserAvatar=asyncHandler(async(req,res)=>{

  //apply multer middleware to accpect the avatar file
  //check if user is login in using verifyjwt middleware
  const avatarLocalPath=req.file?.path;
  if(!avatarLocalPath){
    throw new ApiError("Avatar image is required",400);
  }

  //upload avatar to cloudinary
  const avatar= await uploadOnCloudinary
  (avatarLocalPath)
  if(!avatar){
    throw new ApiError("Error while uploading avatar image to Cloudinary",500);
  }
  //update user avatar in database
  const user=await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
        avatar:avatar?.url
      }
    },{
      new:true
    }
  ).select("-password");

  //response
  return res.status(200).json(
    
    new ApiResponse(200,user,"Avatar updated successfully")
  )


})

const updateUserCoverImage=asyncHandler(async(req,res)=>{
  //apply multer middleware to accpect the cover image file
  //check if user is login in using verifyjwt middleware  
  const coverImageLocalPath=req.file?.path;
  if(!coverImageLocalPath){
    throw new ApiError("Cover image is required",400);
  }
  //upload cover image to cloudinary
  const coverImage= await uploadOnCloudinary
  (coverImageLocalPath) 
  if(!coverImage){
    throw new ApiError("Error while uploading cover image to Cloudinary",500);
  } 
  //update user cover image in database
  const user=await User.findByIdAndUpdate(
    req.user?._id,    
    {
      $set:{
        coverImage:coverImage?.url  
      }
    },
    {
      new:true
    }
  ).select("-password");

  //respose
  return res.status(200).json( 

    new ApiResponse(200,user,"Cover image updated successfully")
  )
 
})

const getUserchannelProfile=asyncHandler(async(req,res)=>{

  const {username}=req.params

  if(!username){
    throw new ApiError("Username is required",400);
  }

  const channel=await User.aggregate(
    [
      { $match:{
        username:username.toLowerCase()
      }
      },
      {
        $lookup:{
          from:"subscriptions",
          localField:"_id",
          foreignField:"channel",
          as:"subscribers"

        }
      },
      {
        $lookup:{
          from:"subscriptions",
          localField:"_id",
          foreignField:"subscriber",
          as:"subscribedTo"
        }
      },
      {
        $addFields:{
          subscribersCount: { $size: "$subscribers" },
          channelsubscibed: { $size: "$subscribedTo"},
          isSubscribed:
          {
           $cond:{
            if:{ $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false
           }
          }
        }
      },
      {
        $project:{
          fullName:1,
          username:1,
          subscriptionsCount:1,
          channelsubscibed:1,
          isSubscribed:1,
          avatar:1,
          coverImage:1
        }
      }

    ]
)
if(!channel?.length){
  throw new ApiError("Channel not found",404);
}
return res.status(200).json(

  new ApiResponse(200,channel[0],"Channel profile fetched successfully")
)

})

const getWatchHistory=asyncHandler(async(req,res)=>{

  const user= User.aggregate([
    {
      $match:{
        _id:mongoose.Types.ObjectId(req.user?._id)
      }
    },
    {
      $lookup:{
        from:"videos",
        localfield:"watchHistory",
        foreignField:"_id",
        as:"watchHistory",
        pipeline:[
          {
            $lookup:{
              from:"users",
              localField:"owner",
              foreignField:"_id",
              as:"owner",
              pipeline:[
                {
                  $project:{
                    fullName:1,
                    username:1,
                    avatar:1
                  }

                },
                {
                  $addFields:{
                    owner:{
                      $first:"$owner"
                    }
                }
                }

              ]
            }
          }
        ]
      }
    }
  ])
  return res.
  status(200).json(
    new ApiResponse(200,user.watchHistory,"User watch history fetched successfully")
  )
})
export {
  registerUser,
  loginUser,
  logoutUser,
  RefreshAccessToken,
  changeCurrentPassword,
  updateAccountDetails,
  updateUserCoverImage,
  updateUserAvatar,
  getUserchannelProfile,
  getWatchHistory
} 