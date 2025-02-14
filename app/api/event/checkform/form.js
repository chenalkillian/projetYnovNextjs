"use client";

import { useState } from "react";
import {
    PaymentElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";
import Cookies from 'js-cookie';

export default function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const event = Cookies.get('data') || '';

    const handleSendEmail = async (eventData) => {
        try {
            const res = await fetch(`/api/send-email`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    event: eventData,

                }),
            });

            if (!res.ok) throw new Error("Erreur lors de l'envoi de l'email");
            toast.success("Email envoyé avec succès !");
        } catch (error) {
            console.error("Erreur:", error);
            toast.error("Erreur lors de l'envoi de l'email");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        handleSendEmail(event);

        if (!stripe || !elements) {
            // Stripe.js hasn't yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Make sure to change this to your payment completion page
                return_url: "http://localhost:3000",
            },
        });

        // This point will only be reached if there is an immediate error when
        // confirming the payment. Otherwise, your customer will be redirected to
        // your `return_url`. For some payment methods like iDEAL, your customer will
        // be redirected to an intermediate site first to authorize the payment, then
        // redirected to the `return_url`.
        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message);
        } else {
            setMessage("An unexpected error occurred.");
        }

        // Récupérer l'email depuis le localStorage
        const email = localStorage.getItem('userEmail');

        // Envoyer l'email après le paiement
        if (email && !error) {
            await sendEmailAfterPayment(email);
        }

        setIsLoading(false);
    };

    const sendEmailAfterPayment = async (userEmail) => {
        try {
            const res = await fetch(`/api/send-email`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    event: { /* Ajoutez ici les détails de l'événement si nécessaire */ },
                    email: userEmail,
                }),
            });

            if (!res.ok) throw new Error("Erreur lors de l'envoi de l'email");
            console.log("Email envoyé avec succès !");
        } catch (error) {
            console.error("Erreur lors de l'envoi de l'email:", error);
        }
    };

    const paymentElementOptions = {
        layout: "accordion",
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit}>

            <PaymentElement id="payment-element" options={paymentElementOptions} />
            <button disabled={isLoading || !stripe || !elements} id="submit">
                <span id="button-text">
                    {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
                </span>
            </button>
            {/* Show any error or success messages */}
            {message && <div id="payment-message">{message}</div>}
        </form>
    );
}