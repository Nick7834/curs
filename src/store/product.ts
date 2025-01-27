import { Product } from "@prisma/client";
import { create } from "zustand";

interface Products {
    products: Product[];
    addProduct: (product: Product) => void;
    updateProduct: (updatedProduct: Product) => void;
    setProducts: (products: Product[]) => void;
    deleteProduct: (id: string) => void;
}
export const useStore = create<Products>((set) => ({
    products: [],
    setProducts: (products) => set({ products }),
    addProduct: (product) => set((state) => ({
        products: [...state.products, product], 
    })),
    updateProduct: (updatedProduct) => set((state) => ({
        products: state.products.map((product) =>
            product.id === updatedProduct.id ? updatedProduct : product
        ),
    })),
    deleteProduct: (id: string) => set((state) => ({
        products: state.products.filter((product) => product.id !== id),
    }))
}));
