import mongoose from 'mongoose';



import dns from 'node:dns';
// Fix for Node.js DNS resolution issues on some Windows machines
dns.setServers(['8.8.8.8', '8.8.4.4']);

import {DB_NAME} from './constants.js';
import dotenv from 'dotenv';
dotenv.config({
    path:'./.env'
})


import { app } from './app.js';

async function connectDB(){
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

        app.on("error", (error) => {
            console.log("ERROR : ", error);
            throw error
        })

        app.listen(process.env.PORT || 8000, () => {
            console.log(`Database connected successfully! and App is listening on port ${process.env.PORT}`);
        })
    }
    catch (error){
        console.error("Error:", error);
        throw error
    }
}
connectDB()



