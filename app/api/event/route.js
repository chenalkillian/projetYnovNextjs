import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';

// Initialisez Firebase avec votre configuration
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

export async function GET() {
    const eventsCollection = collection(db, 'events');
    const eventSnapshot = await getDocs(eventsCollection);
    const events = eventSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return new Response(JSON.stringify(events), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}

export async function POST(req) {
    const body = await req.json();
    const { title, date, location } = body;

    if (!title || !date || !location) {
        return new Response(
            JSON.stringify({ error: "Tous les champs sont requis" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    const eventsCollection = collection(db, 'events');
    const newEvent = await addDoc(eventsCollection, { title, date, location });

    return new Response(JSON.stringify({ id: newEvent.id, title, date, location }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
    });
}

export async function PUT(req) {
    const body = await req.json();
    const { id, title, date, location } = body;

    if (!id || !title || !date || !location) {
        return new Response(
            JSON.stringify({ error: "Tous les champs sont requis" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    const eventRef = doc(db, 'events', id);
    await updateDoc(eventRef, { title, date, location });

    return new Response(JSON.stringify({ id, title, date, location }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}

export async function DELETE(req) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
        return new Response(
            JSON.stringify({ error: "ID requis pour la suppression" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    const eventRef = doc(db, 'events', id);
    await deleteDoc(eventRef);

    return new Response(null, { status: 204 });
}
