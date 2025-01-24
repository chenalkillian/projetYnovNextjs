"use client";

import { useState, useEffect } from 'react';
import Menu from '../Menu';
import EventList from './EventList';
import EventModal from '../components/EventModal';
import { toast } from 'react-hot-toast';

export default function Events() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch("/api/event", { cache: "no-store" });
                if (!res.ok) throw new Error("Failed to fetch events");
                const data = await res.json();
                setEvents(data);
            } catch (error) {
                console.error("Erreur lors du chargement des événements :", error);
                toast.error("Erreur lors du chargement des événements");
            }
        };
        fetchEvents();
    }, []);

    const handleCreateEvent = async (eventData) => {
        try {
            const res = await fetch("/api/event", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(eventData),
            });

            if (!res.ok) throw new Error("Erreur lors de la création de l'événement");

            const newEvent = await res.json();
            setEvents(prev => [...prev, newEvent]);
            toast.success("Événement créé avec succès !");
        } catch (error) {
            console.error("Erreur:", error);
            toast.error("Erreur lors de la création de l'événement");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200">
            <Menu />
            <div className="container mx-auto p-8 pt-24">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-center text-indigo-800">
                        Nos Événements
                    </h1>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-300 shadow-md"
                    >
                        Créer un événement
                    </button>
                </div>
                <EventList events={events} />
                <EventModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleCreateEvent}
                />
            </div>
        </div>
    );
}
