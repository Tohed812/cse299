//lib folder > dbConnect.ts

import mongoose from "mongoose";

//from what values and data type we access from the database
//could be previously connected - we check that here
type ConnectionObject = {
    isConnected? : number;
}

const connection: ConnectionObject = {}

//void cause any datatype can be returned
//using async await as db is in another continent / place
async function dbConnect() : Promise<void>{
    if(connection.isConnected){
        console.log("Already connected to DB");
        return;
    }
        
    try{
        const db = await mongoose.connect(process.env.MONGODB_URI || " ", {})

        connection.isConnected = db.connections[0].readyState //extracting a number - isConnected? : number;

        console.log("DB connected Successfully");

    }
    catch(error){
        console.log("Database connection failed", error);

        process.exit(1);
        
    }
    
}

export default dbConnect;