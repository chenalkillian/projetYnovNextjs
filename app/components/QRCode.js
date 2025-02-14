import { useQRCode } from 'next-qrcode';

export default function QRCode({ data, width = 200 }) {
    const { Image } = useQRCode();

    return (
        <Image
            text={data}
            options={{
                type: 'image/jpeg',
                quality: 1,
                errorCorrectionLevel: 'M',
                margin: 3,
                scale: 4,
                width: width,
                color: {
                    dark: '#000', // Couleur du QR code
                    light: '#FFF', // Couleur de fond
                },
            }}
        />
    );
}
