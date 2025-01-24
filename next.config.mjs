/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    async rewrites() {
        return [
            // Par exemple, une règle qui permet d'accéder à tous les fichiers dans 'pages/'
            // avec n'importe quel nom de fichier comme une route
            {
                source: '/:path*',
                destination: '/:path*', // redirige vers les fichiers dans 'pages/'
            },
        ]
    },
};

export default nextConfig;
