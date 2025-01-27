'use client'
import React from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { SubmitHandler, useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';
import { FormData } from './register';

interface Props {
    setOpen: (open: boolean) => void;
}

export const Login: React.FC<Props> = ({setOpen}) => {

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

    const handleLogin: SubmitHandler<FormData> = async (data) => {
        try {
            const resp = await signIn('credentials', { 
                email: data.email, 
                password: data.password, 
                redirect: false 
            });
            if(!resp?.ok) {
                toast.error(resp?.error);
                return;
            } 
            toast.success("Успешный вход в систему");
            setOpen(false);
        } catch (error) {
            console.error("Error logging in user:", error);
            toast.error("Не удалось войти в систему");
        }
    };

    return (
        <form className="grid gap-4 py-4" onSubmit={handleSubmit(handleLogin)}>
            <div className="grid gap-2">
            <label htmlFor="email-login">Email</label>
            <Input
                id="email-login"
                type="email"
                placeholder="Введите ваш email"
                className='max-w-full w-full py-5 px-3 rounded-[10px] border-[2px] border-solid border-[#333333]'
                {...register('email', {
                    required: 'Введите ваш email',
                    pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Неверный формат электронной почты',
                    },
                })}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <div className="grid gap-2">
            <label htmlFor="password-login">Password</label>
            <Input
                id="password-login"
                type="password"
                placeholder="Введите ваш пароль"
                className='max-w-full w-full py-5 px-3 rounded-[10px] border-[2px] border-solid border-[#333333]'
                {...register('password', {
                    required: 'Введите ваш пароль',
                })}
            />
             {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>

            <Button className="w-full" type="submit">
                Войти
            </Button>
        </form>
    );
};
