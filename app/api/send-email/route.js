import nodemailer from 'nodemailer';
import cookie from 'cookie';
import Cookies from 'js-cookie';
import QRCode from 'qrcode';

export async function POST(req) {
    const { event } = await req.json();

    console.log("Données reçues dans l'API d'envoi d'email :", event);

    // Récupérer les cookies depuis les en-têtes de la requête
    const cookies = cookie.parse(req.headers.get('cookie') || '');
    const email = cookies.userEmail || 'default@example.com';


    // Vérifiez si l'événement est défini
    if (!event) {
        console.error("L'événement est indéfini !");
        return new Response(JSON.stringify({ error: 'L\'événement est indéfini' }), { status: 400 });
    }

    // Configurez votre transporteur d'email ici
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'killianc142@gmail.com',
            pass: 'neigvejc sjojhqsy', // Remplacez par votre mot de passe d'application généré
        },
        tls: {
            rejectUnauthorized: false, // Ignorer les erreurs de certificat
        },
    });

    const handleSendEmail = async (reservationData) => {
        try {
            // Générer le QR code avec les informations de réservation
            const qrCodeData = `
                Nom: ${reservationData.name},
                Email: ${reservationData.email},
                Nombre de billets: ${reservationData.numberOfTickets},
                Événement: ${reservationData.eventTitle},
                Date: ${new Date(reservationData.eventDate).toLocaleString()},
                Lieu: ${reservationData.eventLocation}
            `;
            const qrCodeImage = await QRCode.toDataURL(qrCodeData);

            // Inclure le QR code dans le corps de l'email
            const emailContent = `
              Votre commande à été enregistrer avec succès !
            `;

            const mailOptions = {
                from: 'killianc142@gmail.com',
                to: email,
                subject: `Réservation pour ${event.title}`,
                text: emailContent,

            };

            console.log("Tentative d'envoi de l'email avec les options suivantes :", mailOptions);

            await transporter.sendMail(mailOptions);
            return new Response(JSON.stringify({ message: 'Email envoyé' }), { status: 200 });
        } catch (error) {
            console.error("Erreur lors de l'envoi de l'email:", error);
            return new Response(JSON.stringify({ error: 'Erreur lors de l\'envoi de l\'email' }), { status: 500 });
        }
    };

    return handleSendEmail(event);
}

// Fonction pour générer le QR code en base64
async function generateQRCode(event) {
    const QRCode = require('qrcode');
    const data = `Titre: ${event.title}, Date: ${new Date(event.date).toLocaleString()}, Lieu: ${event.location}`;
    return await QRCode.toDataURL(data);
} 