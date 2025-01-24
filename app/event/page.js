import Menu from '../Menu';
import EventList from './EventList';

export default async function Events() {
    const res = await fetch("http://localhost:3000/api/event", { cache: "no-store" });
    const events = await res.json();

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200">
            <Menu />
            <div className="container mx-auto p-8 pt-24">
                <h1 className="text-4xl font-bold mb-8 text-center text-indigo-800">
                    Nos Événements
                </h1>
                <EventList events={events} />
            </div>
        </div>
    );
}
