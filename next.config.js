/** @type {import('next').NextConfig} */
const nextConfig = {
  // Autoriser l'IP du point d'accès mobile pour les tests sur téléphone

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xucxrnwuxwdwfqvfhlib.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        // Ajout pour récupérer les photos des comptes Google Auth
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },

  // Optimisations PWA
  headers: async () => {
    return [
      {
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
          {
            key: "Service-Worker-Allowed",
            value: "/",
          },
        ],
      },
      {
        source: "/manifest.json",
        headers: [
          {
            key: "Content-Type",
            value: "application/manifest+json",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
