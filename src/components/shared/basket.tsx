'use client'
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaRegTrashCan } from "react-icons/fa6";
import { Button } from '../ui/button';
import toast from 'react-hot-toast';
import { Loader } from './loader';

interface Props {
    className?: string;
} 

interface BasketCart {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

export const Basket: React.FC<Props> = ({ className }) => {

    const [cart, setCart] = useState<BasketCart[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [allQuantity, setAllQuantity] = useState<number>(0);
    const [loader, setLoader] = useState(true);

    useEffect(() => {
        
        const fetchBasket = async () => {
            setLoader(true);
           try {
                const response = await axios.get('/api/basket');
                setCart(response.data.items);
                setTotal(response.data.total);
                setAllQuantity(response.data.allQuantity || 0);
           } catch (error) {
                console.error('Error fetching basket:', error);
           } finally {
                setLoader(false);
           }
        };

        fetchBasket();

    }, []);

    const handleDelete = async (id: string) => {
        try {
            const response = await axios.delete(`/api/basket/${id}/delete`);

            if(response.status === 200) {
                toast.success('Товар успешно удален.');
                const response = await axios.get('/api/basket');
                setCart(response.data.items);
                setTotal(response.data.total);
                setAllQuantity(response.data.allQuantity || 0);
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error('Не удалось удалить товар.');
        }
    };

    if(loader) return <Loader />

    return (
        <div className={className}>

            <h1 className='mt-[20px] text-[#2D3748] text-[30px] font-medium'>Корзина</h1>

            <div className="basket-flex mt-[30px] flex w-[100%] gap-[50px]">

                <div className="cards-basket flex flex-col w-[100%]">

                    {cart && cart.map((item: BasketCart) => (
                        <div key={item.id} className="card-basket w-[100%] flex items-center justify-between gap-[20px] p-[20px]">
                            <div className="flex items-center gap-[20px]">
                                <img src={item.image} alt="img" className='w-[100px] h-[100px] object-cover' />
        
                                    <div className="flex flex-col gap-[5px]">
                                        <h2 className='text-[25px] font-medium'>{item.name}</h2>
                                        <p className='text-base font-normal'>Количество: {item.quantity}</p>
                                    </div>
                            </div>
    
                            <div className='flex gap-[20px]'>
                                <div className="text-[23px] font-medium">{`${Intl.NumberFormat().format(item.price)} ₽`}</div>
                                
                                <div className="flex">
                                    <Button 
                                        className='w-[40px] h-[40px] bg-[#f65858] hover:bg-[#ff7979] rounded-[20px] flex items-center justify-center'
                                        onClick={() => handleDelete(item.id)}
                                    >
                                        <FaRegTrashCan className='text-[16px]' />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>

                <div className="basket-final flex flex-col gap-[10px] bg-[#F0F0F0] w-[300px] p-[20px] rounded-[20px] h-fit">
                    <h2>Товары: {allQuantity}</h2>
                    <span>Итог: {`${Intl.NumberFormat().format(total)}`} ₽</span>
                    <Button className='w-[100%] py-[10px] bg-[#0080ff] rounded-[20px] text-[#F0F0F0] font-medium
                    transition-all ease-out duration-[.3s] hover:bg-[#0080ff]/90'
                    onClick={() => toast.success('Заказ успешно оформлен.')}
                    >Оформить заказ</Button>
                </div>

            </div>

        </div>
    );
};
