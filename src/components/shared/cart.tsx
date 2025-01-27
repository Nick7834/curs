'use client'
import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { BsFillBasket2Fill } from "react-icons/bs";
import { Product } from '@prisma/client';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import { FaEdit } from "react-icons/fa";
import axios from 'axios';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';

interface Props {
    className?: string;
    product: Product;
    handleEdit?: (id: string)  => void
}

export const Cart: React.FC<Props> = ({ className, product, handleEdit }) => {

    const pathname = usePathname();

    const {data: session} = useSession();

    const handleAddBasket = async (id: string) => {
        if(!session) return toast.error('Вы не авторизованы.');

        try {

            const res = await axios.post(`/api/basket`, { productId: id, quantity: 1 });

            if(res.status === 200) {
                toast.success('Товар успешно добавлен в корзину.');
            }
            
        } catch {
            console.error('Error adding product to basket');
            toast.error('Не удалось добавить товар в корзину.');
        }
    }

    return (
        <Link href={`/product/${product?.id}`} className={cn('flex flex-col relative max-w-[300px] w-[100%] p-[15px] rounded-[15px] bg-[#fdfdfd] translate-y-0 transition-all ease-in-out duration-[.5s] hover:shadow-[-1px_2px_8px_5px_rgba(45,55,72,0.1)] hover:translate-y-[-10px]', className)}>
            <img src={product?.image} className='mx-auto h-[200px] rounded-[10px] object-contain' alt="img" />
            <h2 className='text-[16px] font-medium mt-[10px]'>{product?.name}</h2>
            <p className='text-[14px] font-normal mt-[3px]'>{`${product?.description.length > 70 ? product?.description.substring(0, 70).trim() + '...' : product?.description}`}</p>

            <div className="mt-auto flex items-center justify-between gap-[10px] pt-1">
                <span className='text-[16px] font-medium'>{`${Intl.NumberFormat().format(product?.price)}`} ₽</span>
                <Button 
                    className='bg-[#dfe4e9] hover:bg-[#cedae7] p-[10px] rounded-full'
                    onClick={(e) => {
                        e.preventDefault();
                        handleAddBasket(product?.id);
                    }}
                >
                    <BsFillBasket2Fill  className='text-[20px] text-[#2D3748]'/>
                </Button>
            </div>

            {pathname === '/admin' && 
                <div className='absolute top-1 right-1'>
                    <Button 
                        variant='outline' 
                        className='p-1 h-fit bg-white'
                        onClick={(e) => {
                            e.preventDefault();
                            if (handleEdit) {
                                handleEdit(product?.id);
                            }
                        }}
                    >
                        <FaEdit />
                    </Button>
                </div>
            }
        </Link>
    );
};
