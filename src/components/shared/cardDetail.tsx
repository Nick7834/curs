'use client'
import React, { useEffect, useState } from 'react';
import { IoIosArrowDown } from "react-icons/io";
import { BsFillBasket2Fill } from "react-icons/bs";
import { cn } from '@/lib/utils';
import { Product } from '@prisma/client';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Button } from '../ui/button';
import { Loader } from './loader';
import { useSession } from 'next-auth/react';

interface Props {
    className?: string;
    id: string
} 

export const CardDetail: React.FC<Props> = ({ className, id }) => {

    const [maxText, setMaxText] = useState(false);

    const [products, setProducts] = useState<Product>();
    const [loader, setLoader] = useState(true);

    const {data: session} = useSession();

    useEffect(() => {
      
        const fetchProduct = async () => {
            setLoader(true);
            try {
                const response = await axios.get(`/api/product/${id}/detail`);
                setProducts(response.data.product);
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoader(false);
            }
        }

        fetchProduct();

    }, [id]);

    const handTextMax = () => {
        if(!products) return;

        if(maxText) {
            return products?.description;
        }

        return products?.description.length <= 400 ? products?.description : products?.description.slice(0, 400) + '...';
    }

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

    if(loader) return <Loader />

    return (
        <div className={cn('mt-[50px]', className)}>
                <div className='flex flex-col justify-center items-center gap-5 md:flex-row md:items-start'>

                    <img 
                        src={products?.image} alt="img"
                        className='max-w-[500px] w-[100%] max-h-[500px] h-full object-contain'
                    />

                    <div className="flex flex-col">

                        <h1 className='text-[#2D3748] font-medium text-[30px]'>{products?.name}</h1>
                        <div className="mt-[20px] flex flex-col gap-[10px]">
                            <p>{handTextMax()}</p>
                            {products?.description && products?.description.length > 400 && <button onClick={() => setMaxText(!maxText)} className='w-fit flex items-center gap-[10px] font-medium'>{maxText ? 'Show less' : 'Show more'}
                                <IoIosArrowDown className={`${maxText ? 'rotate-[180deg]' : 'rotate-0'}`} />
                            </button>}
                        </div>
                        <span className='mt-5 text-3xl font-medium'>{`${Intl.NumberFormat().format(products?.price || 0)}`} ₽</span>
                        <div className="mt-[20px] flex items-center gap-[20px]">
                            <Button 
                                className='flex items-center gap-[10px] py-[10px] px-[20px] bg-[#edecec] text-slate-700 hover:bg-[#cbcbcb] rounded-full '
                                onClick={() => handleAddBasket(products?.id || '')}
                            >
                                    <BsFillBasket2Fill className='text-[20px] text-[#2D3748]'/>
                                Добавить в корзину
                            </Button>
                        </div> 
                    </div>

                </div>

                <div className="mt-[50px] flex flex-col justify-center items-center">

                    <h2 className='title-grid mt-[20px] text-[#2D3748] text-[25px] font-medium'>Характеристики</h2>

                    <div className='flex flex-col justify-center items-center w-fll'>
                        <div className="mt-[30px] flex flex-col justify-center">
                        {products?.characteristics && (products?.characteristics as { key: string, value: string }[]).map((item, index) => (
                            <div key={index} className="grid grid-cols-2 gap-[10px] p-2 border-b-[1px] last:border-b-0 border-solid border-[#2D3748]">
                                <strong className="capitalize border-r-[1px] pr-2 border-solid border-[#2D3748]">
                                {item.key}:
                                </strong>
                                <span>{item.value}</span>
                            </div>
                        ))}
                        </div>
                    </div>

                </div>
        </div>
    );
};
