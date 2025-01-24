"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { CalendarIcon, MapPinIcon, TicketIcon } from '@heroicons/react/24/outline';

export default function EventCard({ event, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="card group"
        >
            {event.imageUrl && (
                <div className="relative h-48 overflow-hidden rounded-t-xl">
                    <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                </div>
            )}
            <div className="p-6">
                <Link href={`/event/${event.id}`}>
                    <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                        {event.title}
                    </h2>
                </Link>
                
                <div className="space-y-3 mb-4">
                    <div className="flex items-center text-gray-600">
                        <CalendarIcon className="h-5 w-5 mr-2 text-indigo-500" />
                        <span>
                            {new Date(event.date).toLocaleDateString('fr-FR', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </span>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                        <MapPinIcon className="h-5 w-5 mr-2 text-indigo-500" />
                        <span>{event.location}</span>
                    </div>

                    {event.availableTickets !== undefined && (
                        <div className="flex items-center text-gray-600">
                            <TicketIcon className="h-5 w-5 mr-2 text-indigo-500" />
                            <span>
                                {event.availableTickets > 0 
                                    ? `${event.availableTickets} places disponibles`
                                    : 'Complet'}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-center">
                    <Link
                        href={`/event/${event.id}`}
                        className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors"
                    >
                        Voir les détails →
                    </Link>
                    {event.availableTickets > 0 && (
                        <span className="text-green-600 text-sm font-medium px-3 py-1 bg-green-50 rounded-full">
                            Disponible
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
} 