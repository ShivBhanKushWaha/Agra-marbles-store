"use client";

import { useState,useEffect } from "react";
import Heading from "../components/Heading";
import Input from "../components/inputs/Input";
import {FieldValues,useForm,SubmitHandler} from 'react-hook-form'
import Button from "../components/Button";
import Link from "next/link";
import { AiOutlineGoogle } from "react-icons/ai";
import axios from "axios";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SafeUser } from "@/types";

interface RegisterFormProps{
    currentUser:SafeUser | null
}


const RegisterForm: React.FC<RegisterFormProps> = ({currentUser}) => {
    const router = useRouter();

    const [isLoading,setIsLoading] = useState(false);
    const {register,
        handleSubmit,
        formState:{errors},} = useForm<FieldValues>({
            defaultValues:{
                name: "",
                email: "",
                password: "",
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

            axios.post('/api/register',data).then(() =>{
                toast.success('Account created');

                signIn("credentials",{
                    email:data.email,
                    password:data.password,
                    redirect:false,
                }).then((callback) => {
                    if(callback?.ok){
                        router.push('/');
                        router.refresh();
                        toast.success('Logged In!');
                    }

                    if(callback?.error){
                        toast.error(callback?.error);
                    }
                });
            }).catch(() => toast.error("Something went wrong")).finally(() => {
                setIsLoading(false);
            });
        };

        if(currentUser){
            return (
                <div className="text-center text-green-500 text-xl">
                    <p>Logged in...</p>
                </div>
              );
        }


    return ( 
        <>
            <Heading title="Sign up For E~Shop"/>

            <Button outline label="Sign Up with google" 
            icon={AiOutlineGoogle} onClick={() => {signIn("google");}}/>

            <hr className="bg-slate-300 w-full h-px"/>

            <Input id="name" label="name" disabled ={isLoading}
            register={register} errors={errors} required/>

            <Input id="email" label="email" disabled ={isLoading}
            register={register} errors={errors} required/>

            <Input id="password" label="password"  disabled ={isLoading}
            register={register} errors={errors} type="password" required/>

            <Button label={isLoading ? "Loading" : "Sign Up"} 
            onClick={handleSubmit(onSubmit)}/>

            <p className="text-sm">
                Already have an Account ? {" "}<Link href='/login' className="underline">Log In</Link>
            </p>
        </>
     );
}
 
export default RegisterForm;