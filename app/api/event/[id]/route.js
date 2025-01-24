import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

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

export async function GET(request, { params }) {
    try {
        const eventRef = doc(db, 'events', params.id);
        const eventSnap = await getDoc(eventRef);

        if (!eventSnap.exists()) {
            return new Response(
                JSON.stringify({ error: "Événement non trouvé" }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        const eventData = { id: eventSnap.id, ...eventSnap.data() };

        return new Response(JSON.stringify(eventData), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Erreur lors de la récupération de l'événement:", error);
        return new Response(
            JSON.stringify({ error: "Erreur serveur" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
} 