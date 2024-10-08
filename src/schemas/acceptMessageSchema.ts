import {z} from "zod"



export const acceptMessageValidation = z
    .boolean() //checks if accepting message or not


    
export const acceptMessageSchema = z.object({
    acceptMessages: acceptMessageValidation
})