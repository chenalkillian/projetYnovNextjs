export default async function Events() {

    const res = await fetch("http://localhost:3000/api/event", { cache: "no-store" });
    const events = await res.json();

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Événements</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                    <div key={event.id} className="p-6 border border-gray-300 rounded-lg shadow-md bg-white">
                        <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
                        <p className="text-gray-700 mb-1">Date : {event.date}</p>
                        <p className="text-gray-700">Location : {event.location}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
