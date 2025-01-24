"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Menu from '../../Menu';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function EventDetails() {
    const params = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const res = await fetch(`/api/event/${params.id}`);
                if (!res.ok) throw new Error("Événement non trouvé");
                const data = await res.json();
                setEvent(data);
            } catch (error) {
                console.error("Erreur lors du chargement de l'événement :", error);
                toast.error("Impossible de charger les détails de l'événement");
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchEventDetails();
        }
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200">
                <Menu />
                <div className="container mx-auto p-8 pt-24">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div className="h-32 bg-gray-200 rounded mb-4"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200">
                <Menu />
                <div className="container mx-auto p-8 pt-24">
                    <h1 className="text-2xl font-bold text-red-600">Événement non trouvé</h1>
                    <Link href="/" className="text-indigo-600 hover:underline mt-4 inline-block">
                        Retour à la liste des événements
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200">
            <Menu />
            <div className="container mx-auto p-8 pt-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-lg shadow-xl p-8"
                >
                    <div className="mb-8">
                        <Link
                            href="/"
                            className="text-indigo-600 hover:text-indigo-800 transition-colors mb-4 inline-block"
                        >
                            ← Retour aux événements
                        </Link>
                        <h1 className="text-4xl font-bold text-indigo-800 mb-4">{event.title}</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <div className="mb-6">
                                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Date et heure</h2>
                                    <p className="text-gray-600">
                                        {new Date(event.date).toLocaleDateString('fr-FR', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                    <p className="text-gray-600">
                                        {new Date(event.date).toLocaleTimeString('fr-FR', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                <div className="mb-6">
                                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Lieu</h2>
                                    <p className="text-gray-600">{event.location}</p>
                                </div>
                                <div className="mb-6">
                                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Places disponibles</h2>
                                    <p className="text-gray-600">
                                        {event.availableTickets > 0 ? (
                                            <span className="text-green-600 font-semibold">{event.availableTickets} places restantes</span>
                                        ) : (
                                            <span className="text-red-600 font-semibold">Complet</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-700 mb-2">Description</h2>
                                <p className="text-gray-600 whitespace-pre-wrap">{event.description}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-center">
                        {event.availableTickets > 0 ? (
                            <Link 
                                href={`/event/${params.id}/booking`}
                                className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300"
                            >
                                Réserver cet événement
                            </Link>
                        ) : (
                            <button 
                                disabled 
                                className="inline-block bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold cursor-not-allowed"
                            >
                                Événement complet
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
} 