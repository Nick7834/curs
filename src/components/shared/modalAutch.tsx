'use client'
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Login } from './login';
import { Register } from './register';

interface Props {
    open: boolean;
    onClose: () => void;
    setOpen: (open: boolean) => void;
} 

export const ModalAutch: React.FC<Props> = ({ open, onClose, setOpen }) => {
    const [isRegister, setIsRegister] = useState(false);

    const handleClose = () => {
        onClose();
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
             <DialogContent className="w-full max-w-[95%] sm:max-w-md p-4 mx-auto 
            bg-[#ffffff] rounded-md max-h-[90vh] overflow-y-auto">

                <DialogTitle className='text-center text-[#333333] text-xl font-bold'>
                    {isRegister ? "Регистрация" : "Авторизация"}
                </DialogTitle>

               {!isRegister ? (
                    <Login setOpen={setOpen} />
               ) : (
                    <Register setOpen={setOpen} />
               )}

                <div className="flex justify-center mt-4">
                    <Button 
                        variant='outline'
                        onClick={() => setIsRegister(!isRegister)}
                        className="w-full"
                    >
                    {isRegister
                        ? "Авторизация"
                        : "Регистрация"}
                    </Button>
                </div>

            </DialogContent>
        </Dialog>
    );
};
