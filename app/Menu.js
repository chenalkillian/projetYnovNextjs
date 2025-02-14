"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Menu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const menuItems = [
        { name: 'Événements', href: '/event' },
        { name: 'Gestion des événements', href: '/' },
        { name: 'À propos', href: '/about' },
        { name: 'Contact', href: '/contact' },
    ];

    const menuVariants = {
        open: { 
            opacity: 1, 
            height: "auto",
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 20
            }
        },
        closed: { 
            opacity: 0, 
            height: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30
            }
        }
    };

    return (
        <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
            scrolled ? 'bg-white/80 backdrop-blur-lg shadow-lg' : 'bg-transparent'
        }`}>
            <div className="container mx-auto px-6 py-4">
                <div className="flex justify-between items-center">
                    <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text hover:scale-105 transition-transform">
                        EventMaster
                    </Link>
                    
                    <div className="hidden md:flex space-x-8">
                        {menuItems.map((item) => (
                            <Link 
                                key={item.name} 
                                href={item.href}
                                className={`relative group ${
                                    pathname === item.href ? 'text-indigo-600 font-semibold' : 'text-gray-600'
                                }`}
                            >
                                {item.name}
                                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full ${
                                    pathname === item.href ? 'w-full' : ''
                                }`} />
                            </Link>
                        ))}
                    </div>

                    <button 
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden relative w-10 h-10 focus:outline-none group"
                    >
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <span className={`block w-6 h-0.5 bg-gray-600 transition-all duration-300 mb-1.5 ${
                                isOpen ? 'rotate-45 translate-y-2' : ''
                            }`} />
                            <span className={`block w-6 h-0.5 bg-gray-600 transition-all duration-300 mb-1.5 ${
                                isOpen ? 'opacity-0' : ''
                            }`} />
                            <span className={`block w-6 h-0.5 bg-gray-600 transition-all duration-300 ${
                                isOpen ? '-rotate-45 -translate-y-2' : ''
                            }`} />
                        </div>
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={menuVariants}
                        className="md:hidden overflow-hidden bg-white/90 backdrop-blur-lg"
                    >
                        <div className="container mx-auto px-6 py-4">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`block py-3 text-lg ${
                                        pathname === item.href 
                                            ? 'text-indigo-600 font-semibold' 
                                            : 'text-gray-600 hover:text-indigo-600'
                                    } transition-colors duration-300`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Menu;
