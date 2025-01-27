import { cn } from '@/lib/utils';
import React from 'react';

interface Props {
    className?: string;
    children: React.ReactNode;
} 

export const Container: React.FC<Props> = ({ className, children }) => {
    return (
        <div className={cn('max-w-7xl mx-auto px-[15px] w-full', className)}>{children}</div>
    );
};
