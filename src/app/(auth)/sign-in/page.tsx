'use client'
import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Form, FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"


const Page = () => {

    const { toast } = useToast()

    const router = useRouter();

    const form = useForm<z.infer<typeof signInSchema>>({

        resolver: zodResolver(signInSchema),
        defaultValues: {      
           identifier: "",
            password: ""
        }
    })


    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        const result = await signIn('credentials',{
            redirect: false,
            identifier: data.identifier,
            password: data.password
        })

        if(result?.error){
            if(result.error == 'CredentialsSignIn'){
                toast({
                    title: "Login Failed",
                    description: "Incorrect username or password",
                    variant: "destructive"
                })
            }else{
                toast({
                    title: "Error",
                    description: result.error,
                    variant: "destructive"
                })
            }
        }
        
        if(result?.url){
            router.replace('/dashboard')
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
                        Sign in to start your anonymous message
                    </p>
                </div>

                {/* form from Shadcn*/}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        {/* handle username */}
                        

                        {/* handle email */}
                        <FormField
                            name="identifier"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email/ Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="email/username" {...field}
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
                        <Button type="submit">
                            Sign In
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
