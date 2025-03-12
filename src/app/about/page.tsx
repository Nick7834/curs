import { Container } from '@/components/shared/container';
import React from 'react';

export default async function About() {
    return (
        <Container className="mt-10 block" >
            <h1 className="text-5xl font-extrabold text-gray-800 mb-8">О нас</h1>
            <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                Добро пожаловать в наш интернет-магазин! Мы предлагаем широкий ассортимент
                смартфонов по доступным ценам с гарантией качества.
            </p>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Наша цель — сделать покупку смартфонов удобной и быстрой. Мы сотрудничаем
                только с проверенными поставщиками и предлагаем новинки по лучшим ценам.
                Мы гордимся нашим сервисом и индивидуальным подходом к каждому клиенту.
            </p>
            <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-3xl font-semibold text-gray-800 mb-5">Почему выбирают нас?</h2>
                <ul className="list-none space-y-4 text-gray-700 text-left mx-auto max-w-lg">
                    <li className="flex items-center gap-3">
                        <span className="text-green-500 text-2xl">✔</span> Большой выбор современных смартфонов
                    </li>
                    <li className="flex items-center gap-3">
                        <span className="text-green-500 text-2xl">✔</span> Гарантия качества и официальная поддержка
                    </li>
                    <li className="flex items-center gap-3">
                        <span className="text-green-500 text-2xl">✔</span> Быстрая доставка по всей стране
                    </li>
                    <li className="flex items-center gap-3">
                        <span className="text-green-500 text-2xl">✔</span> Удобные способы оплаты
                    </li>
                    <li className="flex items-center gap-3">
                        <span className="text-green-500 text-2xl">✔</span> Профессиональная консультация
                    </li>
                </ul>
            </div>
            <div className="mt-12 p-6 bg-gray-100 rounded-lg shadow-md">
                <h2 className="text-3xl font-semibold text-gray-800 mb-4">Свяжитесь с нами</h2>
                <p className="text-lg text-gray-700 mb-3">Если у вас есть вопросы, мы всегда готовы помочь!</p>
                <p className="text-lg text-gray-700 font-semibold">Email: support@yourstore.com</p>
                <p className="text-lg text-gray-700 font-semibold">Телефон: +7 (999) 123-45-67</p>
            </div>
        </Container>
    );
};
