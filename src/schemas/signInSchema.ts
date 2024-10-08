import {z} from "zod"



//identifier means unique-id. you can set username or email instead identifier as well

export const identifierValidation = z
    .string()

export const passwordValidation = z
    .string()




export const signInSchema = z.object({
    identifier: identifierValidation,
    password: passwordValidation
})