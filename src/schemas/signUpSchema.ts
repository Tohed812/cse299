import {z} from "zod"


//validation logics:

export const usernameValidation = z
    .string() //checks if the input is string?
    .min(3, "Username must be at least 3 characters") //checks if the username is less than 3 chars?
    .max(15, "Username must not exceed 15 characters") //checks if the username is more than 15 chars?
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters") //checks if the username contains a-z A-Z 0-9 chars, nothing else?

export const emailValidation = z
    .string()
    .email({message: "Invalid email format"}) //checks if the input is in email-format

export const passwordValidation = z
    .string()
    .min(6, {message: "Password must be at least 6 characters"})


//assigning validations to the schema

export const signUpSchema = z.object({
    username: usernameValidation,
    email: emailValidation,
    password: passwordValidation
})