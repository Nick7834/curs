'use client'
import { Container } from '@/components/shared/container';
import React, { useState } from 'react';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission logic
    };

    return (
        <Container className="block py-12 px-4 md:px-16">
            <h1 className="text-4xl font-bold mb-8 text-center">Контакты</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Наши контактные данные</h2>
                    <ul className="space-y-4">
                        <li><strong>Телефон:</strong> +7 (999) 123-45-67</li>
                        <li><strong>Email:</strong> support@phoneshop.com</li>
                        <li><strong>Адрес:</strong> Москва, ул. Примерная, д. 1</li>
                    </ul>

                </div>

                <div>
                    <h2 className="text-2xl font-semibold mb-4">Напишите нам</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-lg">Ваше имя</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-lg">Ваш email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="message" className="block text-lg">Сообщение</label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-4 py-2 border rounded-md"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 bg-blue-600 text-white rounded-md"
                        >
                            Отправить сообщение
                        </button>
                    </form>
                </div>
            </div>
        </Container>
    );
}
