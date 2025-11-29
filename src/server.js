// require("dotenv").config({path: "./.env"    });
//must be at the top of the file
//importing the connectDB function from database/index.js

//best way to import dotenv in ES6 module
import dotenv from "dotenv";
dotenv.config({path: "./.env"});
import { app } from "./app.js";

//import connectDB from "./database/index.js";
import connectDB from "./database/index.js";

//conncting to the database
connectDB()
//every async fucntion returns a promise
//to handle the promise we use then and catch

// then is called when the promise is resolved
// inside then we can start the server
// to listen to the port we use app.listen
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is running on port ${process.env.PORT || 8000}`);
        console.log(`serve at http://localhost:${process.env.PORT || 8000}`);
        
    });
})
.catch((err)=>{
    console.log("Error while connecting to the database", err);
});



































import {DB_NAME} from "./constants.js";


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