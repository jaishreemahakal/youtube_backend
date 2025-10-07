import mongoose, { Schema } from 'mongoose';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//bcrypt is used to hash the password before saving it to the database
//jwt is used to generate a token for the user
//read more about bcrypt and jwt 



const userSchema = new Schema({

    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        index:true, 
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index:true,
   
    },
    avatar:{
        type: String, //cloudinary url
        required: true
    },
    coverimage:{
        type: String, //cloudinary url

    },
    watchHistory:[
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password:{
        type: String,
        required: [true, "Password is required"],
    },
    refreshToken:{
        type: String
    }
},{ timestamps: true })

//.pre() is a mongoose middleware that is called before saving the document
//it is used to hash the password before saving it to the database
//not pass the function as an arrow function because we need to use 'this' keyword
//next is a callback function that is called to move to the next middleware
userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password=bcrypt.hash(this.password,10);
    next();

})

//userSchema.methods is used to add methods to the schema
//this method is used to compare the password entered by the user with the hashed password in the database

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {   
            _id: this._id,
            username: this.username,
            email: this.email,
            fullName: this.fullName,
            

        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
 


}
userSchema.methods.RefreshAccessToken = function(){
        return jwt.sign(
        {   
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );
 

}





export const User = mongoose.model("User", userSchema);