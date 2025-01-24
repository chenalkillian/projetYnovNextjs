"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function EventModal({ isOpen, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        title: "",
        date: "",
        time: "",
        location: "",
        description: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Combiner la date et l'heure
        const dateTime = `${formData.date}T${formData.time}`;

        try {
            await onSubmit({
                ...formData,
                date: dateTime,
            });
            onClose();
            setFormData({ title: "", date: "", time: "", location: "", description: "" });
        } catch (error) {
            console.error("Erreur lors de la soumission:", error);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                            <div className="p-6">
                                <h2 className="text-2xl font-bold mb-4 text-indigo-800">Créer un événement</h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Titre
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Date
                                            </label>
                                            <input
                                                type="date"
                                                required
                                                value={formData.date}
                                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Heure
                                            </label>
                                            <input
                                                type="time"
                                                required
                                                value={formData.time}
                                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Lieu
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Description
                                        </label>
                                        <textarea
                                            required
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            rows="3"
                                        />
                                    </div>

                                    <div className="flex justify-end space-x-3 mt-6">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Créer
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
} 