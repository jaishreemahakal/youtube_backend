import {v2 as cloudinary } from "cloudinary";
//explain cloudinary
//cloudinary is a cloud service that provides an API for image and video management
//it allows developers to upload, store, manage, and deliver media assets
import fs from "fs";
//fs is a built-in module in Node.js that allows you to work with the file system


//.config() is used to configure the cloudinary instance with your cloud name, api key and api secret
//
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadOnCloudinary = async (localFilePath) => {
    try {
       if(!localFilePath) return null;
       //upload the file to cloudinary
       const response=await cloudinary.uploader.upload(localFilePath,
        { resource_type: "auto"}
    )
    //file has been uploaded successfully
    console.log("file has been uploaded successfully");
    //print response
    console.log(response); // for testing purpose only
    fs.unlinkSync(localFilePath); //delete the file from local storage saved on the server
    return response;


    } catch (error) {
        fs.unlinkSync(localFilePath); //delete the file from local storage saved on the server as the upload operation failed
        console.error("Error while uploading file to cloudinary", error);
        return null;
        
    }

}
export { uploadOnCloudinary };
