"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Menu from '../../../Menu';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/app/api/event/checkform/form';
import QRCode from "../../../components/QRCode";
import { toast } from "react-hot-toast";
import Cookies from 'js-cookie';
const stripePromise = loadStripe('pk_test_51QprfoEHZnTqZRJue6tGB8563zPp8wDsMIdBPiROrU1t5sK0ple1TYMxaoYY5uZAyCy8b2RRUJugtCChrOdC4BbR00r95YrTti'); // Remplacez par votre clé publique Stripe

const BookingPage = () => {
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        numberOfTickets: 1
    });
    const [clientSecret, setClientSecret] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [amount, setAmount] = useState(0);
    const [currency, setcurrency] = useState('eur');

    const params = useParams();
    const router = useRouter();

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const response = await fetch(`/api/event/${params.id}`);
                const data = await response.json();
                setEvent(data);
                setAmount(data.prix);
                Cookies.set('data', data, { expires: 1 }); // expire dans 1 jour

                console.log(data);

            } catch (error) {
                console.error('Erreur lors du chargement des détails:', error);
                setError('Erreur lors du chargement des détails de l\'événement');
            } finally {
                setLoading(false);
            }
        };

        fetchEventDetails();
    }, [params.id]);

    const validateForm = () => {
        if (!formData.firstName.trim()) return "Le prénom est requis";
        if (!formData.lastName.trim()) return "Le nom est requis";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return "Email invalide";
        if (formData.numberOfTickets < 1) return "Le nombre de billets doit être supérieur à 0";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            const response = await fetch('/api/reservations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    eventId: params.id,
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    numberOfTickets: formData.numberOfTickets
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erreur lors de la réservation');
            }

            // Stocker l'email dans les cookies
            Cookies.set('userEmail', formData.email, { expires: 1 }); // expire dans 1 jour



            setSuccess(`Votre réservation a été confirmée ! Numéro de confirmation : ${data.confirmationNumber}`);

        } catch (error) {
            setError(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        async function createPaymentIntent(amount, currency) {
            try {
                const response = await fetch('/api/stripe/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ amount, currency }),
                });

                if (!response.ok) {
                    throw new Error('Erreur lors de la création du Payment Intent');
                }

                const data = await response.json();
                setClientSecret(data.clientSecret);
            } catch (error) {
                console.error('Erreur:', error);
            }
        }

        if (amount > 0) {
            createPaymentIntent(amount * 100, currency);
        }
    }, [amount, currency]);



    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200">
                <Menu />
                <div className="container mx-auto px-4 pt-20">
                    <div className="text-center">Chargement...</div>
                </div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200">
                <Menu />
                <div className="container mx-auto px-4 pt-20">
                    <div className="text-center">Événement non trouvé</div>
                </div>
            </div>
        );
    }

    return (
        <Elements stripe={stripePromise}>
            <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200">
                <Menu />
                <div className="container mx-auto px-4 pt-20">
                    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                        {event && (
                            <div className="bg-gray-50 p-6 border-b">
                                <h2 className="text-xl font-semibold text-gray-800">Récapitulatif de l'événement</h2>
                                <div className="mt-4">
                                    <p className="text-gray-600"><span className="font-medium">Événement :</span> {event.title}</p>
                                    <p className="text-gray-600"><span className="font-medium">Date :</span> {new Date(event.date).toLocaleDateString('fr-FR')}</p>
                                    <p className="text-gray-600"><span className="font-medium">Lieu :</span> {event.location}</p>
                                </div>
                            </div>
                        )}

                        <div className="p-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-6">Réservation</h1>

                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
                                    {success}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Prénom
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nom
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nombre de billets
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        required
                                        value={formData.numberOfTickets}
                                        onChange={(e) => setFormData({ ...formData, numberOfTickets: parseInt(e.target.value) })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>

                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => router.push(`/event/${params.id}`)}
                                        className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-300"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className={`px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {submitting ? 'Traitement...' : 'Confirmer la réservation et le paiement'}
                                    </button>
                                </div>
                            </form>

                            <div className="mt-8">
                                <h2 className="text-xl font-semibold text-gray-800">Détails de paiement</h2>
                                {clientSecret && (
                                    <Elements options={{ clientSecret }} stripe={stripePromise}>
                                        <CheckoutForm />
                                    </Elements>
                                )}
                            </div>

                            <div className="mt-8">
                                <h2 className="text-xl font-semibold text-gray-800">QR Code</h2>
                                <QRCode data={JSON.stringify({
                                    name: `${formData.firstName} ${formData.lastName}`,
                                    email: formData.email,
                                    numberOfTickets: formData.numberOfTickets,
                                    eventTitle: event.title,
                                    eventDate: new Date(event.date).toLocaleString(),
                                    eventLocation: event.location
                                }, null, 2)} width={300} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Elements>
    );
};

export default BookingPage;