'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function EventList({ events }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, index) => (
                <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow-lg overflow-hidden"
                >
                    <div className="p-6">
                        <Link href={`/event/${event.id}`} className="block hover:opacity-80 transition-opacity">
                            <h2 className="text-xl font-semibold mb-2 text-indigo-700">{event.title}</h2>
                            <p className="text-gray-600 mb-1">
                                {new Date(event.date).toLocaleDateString('fr-FR', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>
                            <p className="text-gray-600 mb-2">
                                {new Date(event.date).toLocaleTimeString('fr-FR', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                            <p className="text-gray-600 mb-4">Lieu : {event.location}</p>
                            {event.description && (
                                <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                            )}
                        </Link>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
