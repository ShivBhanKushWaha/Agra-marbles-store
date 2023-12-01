"use client";

import { useEffect, useState } from "react";
import Heading from "../components/Heading";
import Input from "../components/inputs/Input";
import {FieldValues,useForm,SubmitHandler} from 'react-hook-form'
import Button from "../components/Button";
import Link from "next/link";
import { AiOutlineGoogle } from "react-icons/ai";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { SafeUser } from "@/types";

interface LoginFormProps{
    currentUser:SafeUser | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({currentUser}) => {
    const router = useRouter();
    const [isLoading,setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState:{errors},} = useForm<FieldValues>({
            defaultValues:{
                email:"",
                password:"",
            },
        });

        

        useEffect(() => {
            if(currentUser){
                router.push('/')
                router.refresh();
            }
        },[currentUser,router]);

        const onSubmit:SubmitHandler<FieldValues> = (data) => {
            setIsLoading(true);
            signIn('credentials',{
                ...data,
                redirect:false
            }).then((callback) => {
                setIsLoading(false);

                if(callback?.ok){
                    router.push('/');
                    router.refresh();
                    toast.success('Logged In!');
                }

                if(callback?.error){
                    toast.error(callback?.error)
                }
            });
        };

        if(currentUser){
            return (
                <div className="text-center text-green-500 text-xl">
                    <p>Logged in...</p>
                </div>
            )
        }

    return ( 
        <>
            <Heading title="Sign in to E~Shop"/>


            <Button outline label="Continue with google" disabled={isLoading}
            icon={AiOutlineGoogle} onClick={() => {signIn("google")}}/>

            <hr className="bg-slate-300 w-full h-px"/>

            <Input id="email" label="email" disabled ={isLoading}
            register={register} errors={errors} required/>

            <Input id="password" label="password" disabled ={isLoading}
            register={register} errors={errors} type="password" required/>

            <Button label={isLoading ? "Loading" : "Login"} 
            onClick={handleSubmit(onSubmit)}/>

            <p className="text-sm">Don't have an Account ? {""} <Link href="/register" className="underline">Sign Up</Link></p>
        </>
     );
}
 
export default LoginForm;