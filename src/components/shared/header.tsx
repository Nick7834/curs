'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Container } from './container';
import { usePathname } from 'next/navigation';
import { ModalAutch } from './modalAutch';
import { signOut, useSession } from 'next-auth/react';
import { ImExit } from "react-icons/im";
import { GrBasket } from "react-icons/gr";
import { RiUserSettingsFill } from "react-icons/ri";
import { Loader } from './loader';
import { SiBurgerking } from "react-icons/si";

interface Props {
    className?: string;
} 

const nav = [
    {
        title: 'Главная',
        href: '/'
    },
    {
        title: 'О нас',
        href: '/about'
    },
    {
        title: 'Товары',
        href: '/products'
    },
    {
        title: 'Контакты',
        href: '/contact'
    }
]

export const Header: React.FC<Props> = ({ className }) => {

    const session = useSession();

    const pathname = usePathname();

    const [open, setOpen] = useState(false);

    const [burder, setBurger] = useState(false);

    const handeExit = () => {
        const promt = window.confirm('Вы действительно хотите выйти?');

        if(!promt) return;

        signOut({ callbackUrl: '/' });
    }

    const handleClickBurger = () => {
        setBurger(!burder);

        if(burder) {
            document.body.style.overflow = 'auto';
        } else {
            document.body.style.overflow = 'hidden';
        }
    }

    if(session.status === 'loading') return <Loader />;

    return (
        <header className={cn('py-2 px-5 border-b-[2px]', className)}>
            <Container className='flex justify-between items-center'>

                <Link href="/">
                    <Image src="/logo.png" alt="logo" width={70} height={70} />
                </Link>

                <nav>
                    <ul className='hidden items-center gap-10 md:flex'>
                        {nav.map(item => (
                            <li key={item.title}>
                                <Link 
                                    href={item.href} 
                                    className={cn('text-lg text-[#000] font-medium transition-all ease-in-out duration-300 hover:text-[#0080ff]', pathname === item.href && 'text-[#0080ff]')}>
                                    {item.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

               <div className='flex items-center gap-3'>
                {!session.data ?
                        <Button 
                        className='bg-[#0080ff] transition-all ease-in-out duration-300 hover:bg-[#0080ff]/90'
                        onClick={() => setOpen(true)}
                        >
                        Вход
                        </Button> :
                        <div className='flex items-center gap-3'>
                            {session?.data?.user.role === 'admin' &&
                                <Link href='/admin' className='bg-[#fea724] p-2 rounded-sm transition-all duration-300 hover:bg-[#ffb443]'><RiUserSettingsFill size={20} className='text-[#000000]' /></Link>
                            }
                            <Link href='/basket' className='bg-[#eaeef2] p-2 rounded-sm transition-all duration-300 hover:bg-[#dfe4e8]'><GrBasket size={20} /></Link>
                            <Button 
                                className='bg-[#e03e3e] hover:bg-[#f15a5a]' 
                                onClick={handeExit}>
                                <ImExit />
                            </Button>
                        </div>
                    }

                    <Button onClick={handleClickBurger} className='md:hidden relative z-50'><SiBurgerking /></Button>
               </div>


            </Container>


           {burder && <div className='fixed top-0 left-0 w-full h-full bg-white z-[10]'>
                <nav>
                    <ul className='flex flex-col items-center justify-center h-[100vh] gap-5'>
                            {nav.map(item => (
                                <li key={item.title}>
                                    <Link 
                                        href={item.href} 
                                        className={cn('text-lg text-[#000] font-medium transition-all ease-in-out duration-300 hover:text-[#0080ff]', pathname === item.href && 'text-[#0080ff]')}>
                                        {item.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                </nav> 
            </div>}

            <ModalAutch open={open} onClose={() => setOpen(false)} setOpen={setOpen} />
        </header>
    );
};
