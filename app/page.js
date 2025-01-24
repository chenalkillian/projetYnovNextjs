"use client";

import { useState, useEffect } from "react";
import Menu from "./Menu";
import { motion } from 'framer-motion';
import EventModal from './components/EventModal';
import { toast } from 'react-hot-toast';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la création de l'événement");
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      const res = await fetch(`/api/event?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur lors de la suppression de l'événement");

      setEvents((prevEvents) => prevEvents.filter((e) => e.id !== id));
      toast.success("Événement supprimé avec succès !");
    } catch (error) {
      console.error("Erreur :", error);
      toast.error("Erreur lors de la suppression de l'événement");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200">
      <Menu />
      <div className="container mx-auto p-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-4xl font-bold text-indigo-800">
            Gestion des Événements
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-300 shadow-md"
          >
            Créer un événement
          </button>
        </motion.div>

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
                <h2 className="text-xl font-semibold mb-2 text-indigo-700">{event.title}</h2>
                <p className="text-gray-600 mb-1">Date : {new Date(event.date).toLocaleDateString()}</p>
                <p className="text-gray-600 mb-2">Heure : {new Date(event.date).toLocaleTimeString()}</p>
                <p className="text-gray-600 mb-4">Lieu : {event.location}</p>
                {event.description && (
                  <p className="text-gray-600 mb-4">{event.description}</p>
                )}
                <div className="flex justify-end">
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <EventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateEvent}
        />
      </div>
    </div>
  );
}
