import {z} from "zod"


export const messageValidation = z
    .string()
    .min(10,{message: 'Content must be of at least 10 characters'})
    .max(300,{message: 'Content must be within 300 characters'})



export const messageSchema = z.object({
    content: messageValidation
})


