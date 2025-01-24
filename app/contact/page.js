'use client';

import { motion } from 'framer-motion';
import Menu from '../Menu'; // Assurez-vous que le chemin est correct

export default function Contact() {
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
                    Contactez-nous
                </motion.h1>
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white rounded-lg shadow-lg p-6"
                >
                    <p className="text-gray-700 mb-6 text-lg">
                        Si vous avez des questions ou souhaitez nous contacter, n'hésitez pas à utiliser les informations ci-dessous.
                    </p>
                    <div className="space-y-4">
                        <p className="text-gray-700 flex items-center">
                            <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            <span><strong>Email :</strong> contact@notreentreprise.com</span>
                        </p>
                        <p className="text-gray-700 flex items-center">
                            <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            <span><strong>Téléphone :</strong> +33 1 23 45 67 89</span>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
