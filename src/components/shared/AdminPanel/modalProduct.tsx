'use client'
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useStore } from '@/store/product';
import { Product } from '@prisma/client';
import { JsonObject } from '@prisma/client/runtime/library';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Controller, ControllerRenderProps, useFieldArray, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaImage } from "react-icons/fa6";

interface Props {
    className?: string;
    open: boolean;
    onClose: () => void;
    editProduct?: Product | null
} 

interface FormData {
    name: string;
    price: string;
    description: string;
    characteristics: { key: string; value: string }[];
    image: File | string | null;
}

type Characteristic = { key?: string; value?: string };

export const ModalProduct: React.FC<Props> = ({ open, onClose, editProduct }) => {

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const { addProduct, updateProduct, deleteProduct } = useStore();

    const { control, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        defaultValues: {
            name: '',
            price: '',
            description: '',
            characteristics: [{ key: '', value: '' }],
            image: null,
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'characteristics',
    });

    useEffect(() => {
        if (editProduct) {

            const formattedCharacteristics: Characteristic[] = Array.isArray(editProduct.characteristics)
              ? editProduct.characteristics
                  .filter(
                    (item): item is JsonObject =>
                      typeof item === "object" && item !== null && "key" in item && "value" in item
                  )
                  .map((item) => ({
                    key: String((item)?.key ?? ""),
                    value: String((item)?.value ?? ""),
                  }))
              : [];

        reset({
            name: editProduct.name,
            price: String(editProduct.price), 
            description: editProduct.description,
            characteristics: formattedCharacteristics,
            image: editProduct.image,
        });
            setImagePreview(editProduct.image); 
        } else {
            reset({ 
                name: '',
                price: '',
                description: '',
                characteristics: [{ key: '', value: '' }],
                image: null,
            });
            setImagePreview(null); 
        }
    }, [editProduct, reset]);

    const handleClose = () => {
        setImagePreview(null);
        reset();
        onClose();
    };

    const handleImgeChange = (e: React.ChangeEvent<HTMLInputElement>, field: ControllerRenderProps<FormData, "image">) => {
        const file = e.target.files?.[0];

        if(file) {
            setImagePreview(URL.createObjectURL(file)); 
            field.onChange(file);  
        }
    }

    const onSubmit = async (data: FormData) => {

        setLoading(true);

        try {

            const fromData = new FormData();
            fromData.append('name', data.name);
            fromData.append('price', data.price);
            fromData.append('description', data.description);
            fromData.append('oldPhoto', editProduct?.image || '');
    
            if (data.image) {
                fromData.append('image', data.image);
            }
    
            data.characteristics.forEach((characteristic) => {
                fromData.append('characteristics', JSON.stringify(characteristic));
            });

            if (editProduct) {
                const response = await axios.put(`/api/product/${editProduct.id}/edit`, fromData);
                if (response.status === 200) {
                    toast.success('Товар успешно обновлен.');
                    updateProduct(response.data.updatedProduct);
                    handleClose();
                }
            } else {
                const response = await axios.post('/api/product', fromData);
    
                if (response.status === 200) {
                    toast.success('Товар успешно создан.');
                    addProduct(response.data.createProduct);
                    handleClose();
                }
            }

        } catch (error) {
          if(editProduct){
            console.error('Error updating product:', error);
            toast.error('Не удалось обновить товар.');
          } else {
            console.error('Error creating product:', error);
            toast.error('Не удалось создать товар.');
          }
        } finally {
            setLoading(false);
        }
    
    };

    const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
        e.preventDefault();

        const comf = confirm('Вы уверены, что хотите удалить товар?');

        if (!comf) {
            return;
        }

        setLoading(true);
        try {
            const response = await axios.delete(`/api/product/${id}/delete`);
    
            if (response.status === 200) {
                toast.success('Товар успешно удален.');
                deleteProduct(id);
                handleClose();
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error('Не удалось удалить товар.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
                <DialogContent className="w-full max-w-[95%] sm:max-w-md p-4 mx-auto 
            bg-[#ffffff] rounded-md max-h-[90vh] overflow-y-auto">

                <DialogTitle className='text-center text-[#333333] text-xl font-bold'>
                    {editProduct ? "Редактирование товара" : "Создание товара"}
                </DialogTitle>

                <form className='grid gap-4'>

                    <div className='flex flex-col gap-1 items-center justify-center w-full'>
                        <Controller
                                name="image"
                                control={control}
                                rules={{ required: 'Пожалуйста, выберите изображение' }}
                                render={({ field }) => (
                                    <>
                                        {!imagePreview &&
                                            <>
                                                <Input 
                                                    {...field}
                                                    type="file" 
                                                    className='hidden' 
                                                    accept='image/*'
                                                    value={''}
                                                    id='file' 
                                                    onChange={(e) => handleImgeChange(e, field)}
                                                />
                                                <label htmlFor='file' className='w-full cursor-pointer p-2 bg-[#7e98af] flex items-center justify-center rounded-sm'>
                                                    <FaImage size={20} className='text-white' />
                                                </label>
                                                {errors.image && <p className="text-red-500 text-xs">{errors.image.message}</p>}
                                            </>
                                        }

                                        {imagePreview && (
                                            <div className='relative'>
                                                <img src={imagePreview} alt="img" className='object-cover w-[150px] h-[150px] rounded-md' />
                                                <Button 
                                                    onClick={() => (setImagePreview(null), field.onChange(null))}
                                                    className='absolute top-[-10px] right-[-10px] p-0 flex items-center justify-center rounded-full min-w-5 min-h-5 max-w-5 max-h-5 text-xl leading-[1px] bg-[#e0e0e0] hover:bg-[#e0dee7] text-[#2b2b2b]'>
                                                    ×
                                                </Button>
                                            </div>
                                        )}
                                    </>
                                )}
                            />
                    </div>

                    <Controller
                        name="name"
                            control={control}
                            rules={{ required: 'Название товара обязательно' }}
                            render={({ field }) => (
                                <div className='flex flex-col gap-1'>
                                    <Input
                                        {...field}
                                        placeholder="Название товара"
                                        className="max-w-full w-full py-5 px-3 rounded-[10px] border-[2px] border-solid border-[#333333]"
                                    />
                                    {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                                </div>
                        )}
                    />
                   <Controller
                            name="price"
                            control={control}
                            rules={{ required: 'Цена товара обязательна', pattern: { value: /^\d+$/, message: 'Цена товара должна быть числом' } }}
                            render={({ field }) => (
                               <div className='flex flex-col gap-1'>
                                 <Input
                                    {...field}
                                    placeholder="Цена товара"
                                    className="max-w-full w-full py-5 px-3 rounded-[10px] border-[2px] border-solid border-[#333333]"
                                />
                                {errors.price && <p className="text-red-500 text-xs">{errors.price.message}</p>}
                               </div>
                            )}
                    />
                   <Controller
                        name="description"
                        control={control}
                        rules={{ required: 'Описание товара обязательно' }}
                        render={({ field }) => (
                           <div className='flex flex-col gap-1'>
                            <Input
                                {...field}
                                placeholder="Описание товара"
                                className="max-w-full w-full py-5 px-3 rounded-[10px] border-[2px] border-solid border-[#333333]"
                            />
                            {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
                           </div>
                        )}
                    />

                    <div className="mb-4">
                        <h3 className="font-medium text-lg mb-2 text-center">Характеристики</h3>
                        {fields.map((_, index) => (
                            <div key={index} className="flex items-center gap-2 mb-2 w-full">
                                <Controller
                                    name={`characteristics.${index}.key`}
                                    control={control}
                                    rules={{ required: 'Поле обязательно' }}
                                    render={({ field }) => (
                                        <div className='flex flex-col gap-1 w-full'>
                                            <Input
                                                {...field}
                                                value={field.value || ''}
                                                placeholder="Ключ (например, Цвет)"
                                                className=" w-full py-5 px-3 rounded-[10px] border-[2px] border-solid border-[#333333]"
                                            />
                                            {errors.characteristics?.[index]?.key && <p className="text-red-500 text-xs">{errors.characteristics?.[index]?.key.message}</p>}
                                        </div>
                                    )}
                                />
                                <Controller
                                    name={`characteristics.${index}.value`}
                                    control={control}
                                    rules={{ required: 'Поле обязательно' }}
                                    render={({ field }) => (
                                        <div className='flex flex-col gap-1 w-full'>
                                            <Input
                                                {...field}
                                                value={field.value || ''}
                                                placeholder="Значение (например, Серый)"
                                                className=" w-full py-5 px-3 rounded-[10px] border-[2px] border-solid border-[#333333]"
                                            />
                                            {errors.characteristics?.[index]?.value && <p className="text-red-500 text-xs">{errors.characteristics?.[index]?.value.message}</p>}
                                        </div>
                                    )}
                                />
                               {fields.length > 1 && (
                                    <Button
                                        variant="outline"
                                        onClick={() => remove(index)}
                                        className="text-red-500 font-bold px-2 hover:text-red-600"
                                    >
                                        ×
                                    </Button>
                                )}
                            </div>
                        ))}
                        <Button
                            variant='outline'
                            type="button"
                            onClick={() => append({ key: '', value: '' })}
                            className="text-blue-500 font-bold mt-2 w-full"
                        >
                            + Добавить характеристику
                        </Button>
                    </div>

                    <div className='flex flex-col gap-1'>
                        <Button onClick={handleSubmit(onSubmit)} disabled={loading}>{editProduct ? "Обновить товар" : "Создать товар"}</Button>
                        {editProduct && 
                            <Button 
                                onClick={(e) => handleDelete(e, editProduct.id)}
                                className="bg-red-500 hover:bg-red-600 font-bold mt-2 w-full"
                                disabled={loading}
                            >
                                Удалить товар
                        </Button>}
                    </div>
                </form>

            </DialogContent>
    </Dialog>
    );
};
