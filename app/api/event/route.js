let events = [
    { id: 1, title: "Événement 1", date: "2022-01-01", location: "Paris" },
    { id: 2, title: "Événement 2", date: "2022-01-02", location: "Lyon" },
    { id: 3, title: "Événement 3", date: "2022-01-03", location: "Marseille" },
];

export async function GET() {
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

    const newEvent = { id: events.length + 1, title, date, location };
    events.push(newEvent);

    return new Response(JSON.stringify(newEvent), {
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

    const index = events.findIndex((event) => event.id === id);
    if (index === -1) {
        return new Response(
            JSON.stringify({ error: "Événement introuvable" }),
            { status: 404, headers: { "Content-Type": "application/json" } }
        );
    }

    events[index] = { id, title, date, location };
    return new Response(JSON.stringify(events[index]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}

export async function DELETE(req) {
    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get("id"));

    if (!id) {
        return new Response(
            JSON.stringify({ error: "ID requis pour la suppression" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    events = events.filter((event) => event.id !== id);
    return new Response(null, { status: 204 });
}
