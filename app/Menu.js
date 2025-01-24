"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const Menu = () => {
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { name: 'Accueil', href: '/' },
        { name: 'Événements', href: '/event' },
        { name: 'À propos', href: '/about' },
        { name: 'Contact', href: '/contact' },
    ];

    const menuVariants = {
        open: { opacity: 1, height: "auto" },
        closed: { opacity: 0, height: 0 }
    };

    return (
        <nav className="fixed top-0 left-0 z-50 w-full bg-white shadow-md">
            <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold text-indigo-800">EventMaster</Link>
                <div className="hidden md:flex space-x-6">
                    {menuItems.map((item) => (
                        <Link key={item.name} href={item.href} className="text-gray-700 hover:text-indigo-600 transition duration-300">
                            {item.name}
                        </Link>
                    ))}
                </div>
                <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-700 hover:text-indigo-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>
            <motion.div
                initial="closed"
                animate={isOpen ? "open" : "closed"}
                variants={menuVariants}
                transition={{ duration: 0.3 }}
                className="md:hidden overflow-hidden bg-white"
            >
                {menuItems.map((item) => (
                    <Link key={item.name} href={item.href} className="block px-4 py-2 text-gray-700 hover:bg-indigo-100 hover:text-indigo-600 transition duration-300">
                        {item.name}
                    </Link>
                ))}
            </motion.div>
        </nav>
    );
};

export default Menu;
