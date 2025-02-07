import Stripe from 'stripe';

const stripe = new Stripe('sk_test_51QprfoEHZnTqZRJuDHTSu8YIr5oukG7j1M86VZrgbICcz6bEU1iKbOzsA4QB2oHI3mcxpCWvVjh86Qvm0l11Pson00JnWxnXHQ'); // Remplacez par votre clé secrète Stripe

export async function GET(req) {
    try {
        // Test de la connexion à Stripe
        const account = await stripe.accounts.retrieve();
        return new Response(JSON.stringify(account), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

// Fonction pour créer un compte Custom Connect individuel
export async function POST_createAccount(req) {
    const { email } = await req.json();
    try {
        const account = await stripe.accounts.create({
            type: 'custom',
            country: 'FR', // Remplacez par le pays approprié
            email: email,
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true },
            },
        });
        return new Response(JSON.stringify(account), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

// Fonction pour envoyer des fichiers pour la vérification
export async function POST_uploadFile(req) {
    const { accountId, file } = await req.json();
    try {
        const fileUpload = await stripe.files.create({
            purpose: 'identity_document',
            file: {
                data: file,
                name: 'identity_document.jpg', // Remplacez par le nom de votre fichier
                type: 'application/octet-stream',
            },
            // Assurez-vous que le compte est vérifié
            metadata: { accountId: accountId },
        });
        return new Response(JSON.stringify(fileUpload), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

// Fonction pour créer un Payment Intent
export async function POST(req) {
    const { amount, currency } = await req.json();
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            automatic_payment_methods: {
                enabled: true,
            },
        });

        return new Response(JSON.stringify({ clientSecret: paymentIntent.client_secret }), { status: 200 });

    } catch (error) {
        console.error('Erreur lors de la création du Payment Intent:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}