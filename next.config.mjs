/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
      config.externals = [...config.externals, { canvas: 'canvas' }]; // required to make Konva & react-konva work
      return config;
    },
    async redirects() {
      return [
        {
          source: "/",
          destination: "/kuisioner",
          permanent: true,
        },
      ];
    },
  };  

export default nextConfig;
