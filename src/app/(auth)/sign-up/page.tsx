'use client'
import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import {  useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, {AxiosError} from 'axios'
import { ApiResponse } from "@/types/ApiResponse";
import { Form, FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";


const Page = () => {
    
    //1. useState
    const [username, setUsername] = useState('')
    const [usernameMessage, setUsernameMessage] = useState('')
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    //2. we need to send the usernames and receive it back

    //set username and as soon as it is set we send request to backend to get its value - so we use useDebounceValue
    const debounced = useDebounceCallback(setUsername, 300)

    //3. Toast
    const { toast } = useToast()

    //4. Router to send username in different places
    const router = useRouter()

    //5. zod implementation
    const form = useForm<z.infer<typeof signUpSchema>>({

        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: ""
        }
    })

    //6. Hook - to check if unique name is available or not
    useEffect(() => {
        const checkUsernameUnique = async () => {
            if (username) {
                setIsCheckingUsername(true)
                setUsernameMessage('')

                try {
                    //AXIOS :
                    const response = await axios.get(`/api/check-username-unique?username=${username}`)
                   
                    const message = response.data.message
                   
                    setUsernameMessage(message)
                }
                catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;

                    setUsernameMessage(
                        axiosError.response?.data.message ?? "Error checking username"
                    )
                }
                finally {
                    setIsCheckingUsername(false)
                }
            }
        }

        //run the function
        checkUsernameUnique()
    }, [username])



    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true)

        try {
            const response = await axios.post<ApiResponse>('/api/sign-up', data)

            toast({
                title: 'Success',
                description: response.data.message
            })
            
            router.replace(`/verify/${username}`)
            
            setIsSubmitting(false)
        }
        catch (error) {
            console.error("Error in Signup", error)

            const axiosError = error as AxiosError<ApiResponse>;

            const errorMessage = axiosError.response?.data.message

            toast({
                title: "Signup failed",
                description: errorMessage,
                variant: "destructive"
            })

            setIsSubmitting(false)

        }
    }



    return (
        <div className=" flex justify-center items-center min-h-screen bg-gray-100 ">
            
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md ">

                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Join Mystery Message
                    </h1>
                    <p className="mb-4">
                        Sign Up to start your anonymous message
                    </p>
                </div>

                {/* form from Shadcn*/}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        {/* handle username */}
                        <FormField
                            name="username"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="username" {...field}
                                            onChange={(event) => {
                                                field.onChange(event)
                                                debounced(event.target.value)
                                            }}
                                        />
                                    </FormControl>

                                    {isCheckingUsername && <Loader2 className="animate-spin"/>}

                                    <p className = {`text-sm ${usernameMessage === "Username is unique" ? 'text-green-500' : 'text-red-500' }`}>
                                        test{usernameMessage}
                                    </p>
                                   
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* handle email */}
                        <FormField
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="email" {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>This is your public display name.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* handle password */}
                        <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="password" {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>This is your public display name.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* button */}
                        <Button type="submit" disabled={isSubmitting}>
                            {
                                isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>   Please Wait
                                        
                                    </>

                                ) : ('Signup')
                            }

                        </Button>
                    </form>


                    <div className="text-center mt-4">
                        <p>
                            Already Member?{''}
                            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
                                Sign In
                            </Link>
                        </p>

                    </div>

                </Form>

            </div>
        </div>
    );
};

export default Page; 
