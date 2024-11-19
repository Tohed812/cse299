import { getServerSession } from "next-auth"; 
import { authOptions } from "../auth/[...nextauth]/options"; 
import dbConnect from "@/lib/dbConnect"; 
import UserModel from "@/app/model/User";
import { User } from "next-auth"; 



export async function POST(request: Request) { //switch on or off? its a req
    await dbConnect(); 

    const session = await getServerSession(authOptions); //current logged in user session
    const user: User = session?.user as User; //that session's user

    
    if (!session || !session.user) {
        return new Response(
            JSON.stringify({
                success: false,
                message: "Not Authenticated", 
            }),
            { status: 401 } 
        );
    }

    const userId = user._id; 
    const { acceptMessages } = await request.json(); 




    //error handling: request successful? or not?

    try {
        
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId, 
            { isAcceptingMessage: acceptMessages }, 
            { new: true } 
        );

        if (!updatedUser) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Failed to update user status to accept messages", 
                }),
                { status: 401 } 
            );
        }

        return new Response(
            JSON.stringify({
                success: true, 
                message: "Message acceptance status updated successfully", 
                updatedUser, 
            }),
            { status: 200 } 
        );
    } catch (error) {
        
        console.log("Failed to update user status to accept messages", error);
        return Response.json(
            JSON.stringify(
                {
                success: false, 
                message: "Failed to update user status to accept messages",
            }),
            { status: 500 } 
        );
    }
}





export async function GET(request: Request) {
    await dbConnect(); 

    const session = await getServerSession(authOptions); 
    const user: User = session?.user as User; 

    if (!session || !session.user) {
        return new Response(
            JSON.stringify({
                success: false,
                message: "Not Authenticated", 
            }),
            { status: 401 } 
        );
    }

    const userId = user._id; 

    try {
        const foundUser = await UserModel.findById(userId)

        if(!foundUser){
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                {
                    status: 404
                }
            )
        }

        return Response.json(
            {
                success: true,
                isAcceptingMessages: foundUser.    isAcceptingMessage
            },
            {
                status: 200
            }
        )
    } catch (error) {
        
        console.log("Failed to update user status to accept messages", error);

        return Response.json(
            JSON.stringify(
                {
                success: false, 
                message: "Error in getting Acceptance Status",
            }),
            { status: 500 } 
        );
    }
}
