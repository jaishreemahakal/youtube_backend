// require("dotenv").config({path: "./.env"    });

//best way to import dotenv in ES6 module
import dotenv from "dotenv";
dotenv.config({path: "./.env"});

//import connectDB from "./database/index.js";
import connectDB from "./database/index.js";

//conncting to the database
connectDB();

































import express from "express";
const app =express();


/*
// connecting to the database
(async ()=>{

    try{
        await mongoose.connect(`&{process.env.MONGODB_URL}
            /${DB_NAME}`);
        console.log("Connected to the database");
        app.on("error", (err)=>{
            console.log("Error while connecting to the database", err);
        })
        app.listen(process.env.PORT, ()=>{
            console.log(`Server is running on port ${process.env.PORT}`);
        });

    }
    catch(err){
        console.log("Error while connecting to the database", err);
    }










})()
*/