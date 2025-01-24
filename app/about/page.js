'use client';

import { motion } from 'framer-motion';
import Menu from '../Menu'; // Assurez-vous que le chemin est correct

export default function About() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200">
            <Menu />
            <div className="container mx-auto p-8 pt-24">
                <motion.h1
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl font-bold mb-8 text-center text-indigo-800"
                >
                    À propos de nous
                </motion.h1>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white rounded-lg shadow-lg p-6"
                >
                    <p className="text-gray-700 mb-4 leading-relaxed text-lg">
                        Bienvenue sur notre site. Nous sommes une entreprise passionnée, dédiée à l'organisation d'événements exceptionnels qui laissent une impression durable.
                    </p>
                    <p className="text-gray-700 leading-relaxed text-lg">
                        Notre mission est de transformer vos idées en réalité, en créant des expériences mémorables et en fournissant un service personnalisé de la plus haute qualité pour chaque événement que nous organisons.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
