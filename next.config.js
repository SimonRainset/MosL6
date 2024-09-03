/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/hci",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
