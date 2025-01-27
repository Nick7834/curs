'use client'
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { ModalProduct } from './modalProduct';
import axios from 'axios';
import { Cart } from '../cart';
import { Product } from '@prisma/client';
import { useStore } from '@/store/product';
import { Loader } from '../loader';

interface Props {
    className?: string;
} 

export const AdminPanel: React.FC<Props> = ({ className }) => {

    const {data: session} = useSession();

    const [open, setOpen] = useState(false);

    const [editProduct, setEditProduct] = useState<Product | null>(null);

    const { products, setProducts } = useStore((state) => state);
    const [loader, setLoader] = useState(true);

    useEffect(() => {
      
        const fetchProduct = async () => {
            setLoader(true);
            try {
                const response = await axios.get('/api/product');
                setProducts(response.data.products);
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoader(false);
            }
        }

        fetchProduct();

    }, [setProducts]);

    const handleEdit = async (id: string) => {
        if(!id) return;

        try {
            const { data: resp } = await axios.get(`/api/product/${id}/detail`);
            setEditProduct(resp.product);
            setOpen(true);
        } catch (error) {
            console.error('Error fetching product:', error);
        }
    }

    const handleAddProduct = () => {
        setEditProduct(null); 
        setOpen(true);
    }

    if(loader) return <Loader />;

    return (
        <div className={className}>

            <h1 className='flex items-center justify-center gap-2 mx-auto mt-[20px] text-xl text-center'>Admin: <span className='font-medium text-xl first-letter:uppercase'>{session?.user.username}</span></h1>
            
            <div>
                <Button 
                    className='flex items-center mx-auto mt-[20px]'
                    onClick={handleAddProduct}
                >
                    Добавить товар
                </Button>
            </div>

            <ModalProduct open={open} onClose={() => setOpen(false)} editProduct={editProduct} />

            <div className='mt-20 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full'>
            {products && products.length > 0 ? (
                products.map((product) => (
                    <Cart key={product.id} product={product} handleEdit={handleEdit} />
                ))
            ) : (
                <p>No products available.</p> 
            )}
            </div>

        </div>
    );
};
