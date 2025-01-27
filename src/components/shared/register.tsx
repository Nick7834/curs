'use client'
import React from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import axios from 'axios';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';
import { useForm, SubmitHandler } from 'react-hook-form';

export interface FormData {
    email: string;
    username: string;
    password: string;
}

interface Props {
    setOpen: (open: boolean) => void;
}

export const Register: React.FC<Props> = ({setOpen}) => {

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

    const handleRegister: SubmitHandler<FormData> = async (data) => {
        try {
 
         await axios.post("/api/register", data);
 
         const resp = await signIn('credentials', { 
             email: data.email, 
             password: data.password, 
             redirect: false 
         });
 
         if(!resp?.ok) {
             toast.error(resp?.error);
             return;
         } 
 
         toast.success("Успешная регистрация");
         setOpen(false);
 
        } catch (error) {
         console.error("Error registering user:", error);
         toast.error("Не удалось зарегистрироваться.");
        }
     };

    return (
        <form className="grid gap-4 py-4" onSubmit={handleSubmit(handleRegister)}>
            <div className="grid gap-2">
                <label htmlFor="name">Имя</label>
                    <Input 
                        id="name" 
                        placeholder="Введите ваше имя"
                        className='max-w-full w-full py-5 px-3 rounded-[10px] border-[2px] border-solid border-[#333333]'
                        {...register('username', { required: 'Имя обязательно для ввода' })}
                   />
                   {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
            </div>
            <div className="grid gap-2">
                    <label htmlFor="email-register">Email</label>
                    <Input
                        id="email-register"
                        type="email"
                        placeholder="Введите ваш email"
                        className='max-w-full w-full py-5 px-3 rounded-[10px] border-[2px] border-solid border-[#333333]'
                        {...register('email', {
                            required: 'Email обязателен для ввода',
                            pattern: {
                              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                              message: 'Введите корректный email',
                            },
                        })}
                   />
                   {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <div className="grid gap-2">
                     <label htmlFor="password-register">Password</label>
                     <Input
                        id="password-register"
                        type="password"
                        placeholder="Придумайте пароль"
                        className='max-w-full w-full py-5 px-3 rounded-[10px] border-[2px] border-solid border-[#333333]'
                        {...register('password', { 
                            required: 'Пароль обязателен для ввода' ,
                            minLength: {
                              value: 6,
                              message: 'Пароль должен содержать не менее 6 символов',
                            },
                        })}
                  />
                  {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>
            <Button className="w-full" type="submit">
                Зарегистрироваться
            </Button>
        </form>
    );
};
