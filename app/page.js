"use client";

import { useState, useEffect } from "react";
import Menu from "./Menu"; // Assurez-vous que le chemin est correct
import { motion } from 'framer-motion';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: "", date: "", location: "" });
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/event", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        setEvents(data);
      } catch (error) {
        console.error("Erreur lors du chargement des événements :", error);
      }
    };
    fetchEvents();
  }, []);

  const handleAddOrUpdateEvent = async () => {
    if (!newEvent.title || !newEvent.date || !newEvent.location) {
      alert("Tous les champs sont requis !");
      return;
    }

    try {
      const url = "/api/event";
      const options = editingEvent
        ? {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...newEvent, id: editingEvent.id }),
        }
        : {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newEvent),
        };

      const res = await fetch(url, options);
      if (!res.ok) throw new Error("Erreur lors de la sauvegarde de l'événement");

      const event = await res.json();
      if (editingEvent) {
        setEvents((prevEvents) =>
          prevEvents.map((e) => (e.id === editingEvent.id ? event : e))
        );
      } else {
        setEvents((prevEvents) => [...prevEvents, event]);
      }

      setNewEvent({ title: "", date: "", location: "" });
      setEditingEvent(null);
    } catch (error) {
      console.error("Erreur :", error);
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      const res = await fetch(`/api/event?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur lors de la suppression de l'événement");

      setEvents((prevEvents) => prevEvents.filter((e) => e.id !== id));
    } catch (error) {
      console.error("Erreur :", error);
    }
  };

  const handleEditEvent = (event) => {
    setNewEvent({ title: event.title, date: event.date, location: event.location });
    setEditingEvent(event);
  };

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
          Gestion des Événements
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold mb-4 text-indigo-700">
            {editingEvent ? "Modifier l'événement" : "Ajouter un événement"}
          </h2>
          <input
            type="text"
            placeholder="Titre"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            className="p-2 border border-gray-300 rounded mb-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="date"
            value={newEvent.date}
            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
            className="p-2 border border-gray-300 rounded mb-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            placeholder="Lieu"
            value={newEvent.location}
            onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
            className="p-2 border border-gray-300 rounded mb-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleAddOrUpdateEvent}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105"
          >
            {editingEvent ? "Modifier" : "Ajouter"}
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
                <p className="text-gray-600 mb-1">Date : {event.date}</p>
                <p className="text-gray-600 mb-4">Lieu : {event.location}</p>
                <div className="flex justify-between">
                  <button
                    onClick={() => handleEditEvent(event)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
