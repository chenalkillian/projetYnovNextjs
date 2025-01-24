import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCe3iXCefDgAlSaQH_DvUro3mzmqAVBwrk",
    authDomain: "projetnextjs-67c48.firebaseapp.com",
    projectId: "projetnextjs-67c48",
    storageBucket: "projetnextjs-67c48.firebasestorage.app",
    messagingSenderId: "605413315565",
    appId: "1:605413315565:web:60a7b0265a704f30d70de4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function POST(request) {
    try {
        const data = await request.json();
        const { eventId, name, email, numberOfTickets } = data;

        // Vérifier si l'événement existe et s'il reste des places
        const eventDoc = doc(db, 'events', eventId);
        const eventSnapshot = await getDoc(eventDoc);

        if (!eventSnapshot.exists()) {
            return new Response(JSON.stringify({ error: "Événement non trouvé" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        const eventData = eventSnapshot.data();
        const availableTickets = eventData.availableTickets ?? 100;

        if (availableTickets < numberOfTickets) {
            return new Response(JSON.stringify({ 
                error: "Nombre de places insuffisant" 
            }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Créer la réservation
        const reservationRef = await addDoc(collection(db, 'reservations'), {
            eventId,
            name,
            email,
            numberOfTickets,
            status: 'confirmed',
            createdAt: new Date().toISOString(),
            confirmationNumber: Math.random().toString(36).substring(2, 15).toUpperCase()
        });

        // Mettre à jour le nombre de places disponibles
        await updateDoc(eventDoc, {
            availableTickets: availableTickets - numberOfTickets
        });

        // Récupérer la réservation créée pour avoir le numéro de confirmation
        const reservationDoc = await getDoc(reservationRef);
        const reservationData = reservationDoc.data();

        return new Response(JSON.stringify({
            success: true,
            confirmationNumber: reservationData.confirmationNumber,
            message: "Réservation confirmée"
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Erreur lors de la réservation:", error);
        return new Response(JSON.stringify({ error: "Erreur serveur" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}