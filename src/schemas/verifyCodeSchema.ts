import {z} from "zod"


export const verificationCodeValidation = z
    .string()
    .length(6, "Verification Code must be 6 digits long") //checks if the input is 6 digit longer



export const verificationCodeSchema = z.object({
    code: verificationCodeValidation
})