'use client'
import { Product } from '@prisma/client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Cart } from './cart';
import { cn } from '@/lib/utils';
import { Loader } from './loader';

interface Props {
    className?: string;
} 

export const ProductsCart: React.FC<Props> = ({ className }) => {

    const [products, setProducts] = useState<Product[]>([]);
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

    }, [])

    return (
        <div className={cn('mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full', className)}>
            {loader ? <Loader /> : products.map((product) => (
                <Cart key={product.id} product={product} />
            ))}
        </div>
    );
};
