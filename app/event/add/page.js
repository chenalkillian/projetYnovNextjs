"use client";

import { useState } from "react";
import { useRouter } from "next/router";

export default function AddEvent() {
    const [newEvent, setNewEvent] = useState({ title: "", date: "", location: "" });
    const router = useRouter();

    const handleAddEvent = async () => {
        if (!newEvent.title || !newEvent.date || !newEvent.location) {
            alert("Tous les champs sont requis !");
            return;
        }

        try {
            const res = await fetch("/api/event", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newEvent),
            });

            if (!res.ok) throw new Error("Erreur lors de l'ajout de l'événement");

            router.push("/event");
        } catch (error) {
            console.error("Erreur :", error);
        }
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-4xl font-bold mb-6 text-gray-800">Ajouter un événement</h1>
            <div className="mb-8">
                <input
                    type="text"
                    placeholder="Titre"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="p-3 border border-gray-300 rounded-lg mb-4 w-full"
                />
                <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="p-3 border border-gray-300 rounded-lg mb-4 w-full"
                />
                <input
                    type="text"
                    placeholder="Lieu"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    className="p-3 border border-gray-300 rounded-lg mb-4 w-full"
                />
                <button
                    onClick={handleAddEvent}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                >
                    Ajouter
                </button>
            </div>
        </div>
    );
}
