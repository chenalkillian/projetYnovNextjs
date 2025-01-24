"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

const EventDetails = () => {
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const params = useParams();

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const response = await fetch(`/api/events/${params.id}`);
                const data = await response.json();
                setEvent(data);
            } catch (error) {
                console.error('Erreur lors du chargement des détails:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEventDetails();
    }, [params.id]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 pt-20">
                <div className="text-center">Chargement...</div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="container mx-auto px-4 pt-20">
                <div className="text-center">Événement non trouvé</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 pt-20">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                {event.imageUrl && (
                    <div className="w-full h-64 relative">
                        <img 
                            src={event.imageUrl} 
                            alt={event.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}
                <div className="p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
                    
                    <div className="flex flex-wrap gap-4 mb-6">
                        <div className="flex items-center text-gray-600">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{new Date(event.date).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{event.location}</span>
                        </div>
                    </div>

                    <div className="prose max-w-none mb-8">
                        <p className="text-gray-700">{event.description}</p>
                    </div>

                    {event.speakers && event.speakers.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">Intervenants</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {event.speakers.map((speaker) => (
                                    <div key={speaker.id} className="flex items-center space-x-4">
                                        <img 
                                            src={speaker.avatar || '/default-avatar.png'} 
                                            alt={speaker.name}
                                            className="w-12 h-12 rounded-full"
                                        />
                                        <div>
                                            <div className="font-medium">{speaker.name}</div>
                                            <div className="text-sm text-gray-500">{speaker.role}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <Link 
                        href={`/events/${params.id}/booking`}
                        className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300"
                    >
                        Réserver cet événement
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default EventDetails; 