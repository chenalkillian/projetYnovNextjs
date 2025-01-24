"use client";

import { useState, useEffect } from "react";

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
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Événements</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          {editingEvent ? "Modifier l'événement" : "Ajouter un événement"}
        </h2>
        <input
          type="text"
          placeholder="Titre"
          value={newEvent.title}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          className="p-2 border border-gray-300 rounded mb-2 w-full"
        />
        <input
          type="date"
          value={newEvent.date}
          onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
          className="p-2 border border-gray-300 rounded mb-2 w-full"
        />
        <input
          type="text"
          placeholder="Lieu"
          value={newEvent.location}
          onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
          className="p-2 border border-gray-300 rounded mb-2 w-full"
        />
        <button
          onClick={handleAddOrUpdateEvent}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {editingEvent ? "Modifier" : "Ajouter"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="p-6 border border-gray-300 rounded-lg shadow-md bg-white">
            <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
            <p className="text-gray-700 mb-1">Date : {event.date}</p>
            <p className="text-gray-700">Lieu : {event.location}</p>
            <button
              onClick={() => handleEditEvent(event)}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mr-2"
            >
              Modifier
            </button>
            <button
              onClick={() => handleDeleteEvent(event.id)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
