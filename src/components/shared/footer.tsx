import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import { Container } from './container';

interface Props {
    className?: string;
} 

export const Footer: React.FC<Props> = ({ className }) => {
    return (
        <footer className={cn('py-5 border-t-[2px] mt-28', className)}>
            <Container>

                <div className="flex justify-between gap-2 items-center">
                    <Link href="/">
                        <Image src="/logo.png" alt="logo" width={70} height={70} />
                    </Link>

                    <div className="mt-4">
                        <p className='text-lg text-[#000] font-medium'>Контакты:</p>
                        <p className='mt-2 flex items-center gap-2 text-lg text-[#000] font-medium'>
                            Телефон: <a href="tel:+71234567890" className="text-lg text-[#434343] font-medium">+7 123 456 78 90</a>
                        </p>
                        <p className='mt-2 flex items-center gap-2 text-lg text-[#000] font-medium'>
                            Email: <a href="mailto:example@email.com" className="text-lg text-[#434343] font-medium">example@email.com</a>
                        </p>
                    </div>
                </div>

                <div className="mt-4">
                        <p>© 2025 Компания. Все права защищены.</p>
                </div>

            </Container>
        </footer>
    );
};
