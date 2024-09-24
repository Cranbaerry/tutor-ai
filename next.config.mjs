/** @type {import('next').NextConfig} */
const nextConfig = {
  // experimental: {
  //   taint: true,
  // },
  webpack: (config) => {
    config.externals = [...config.externals, { canvas: 'canvas' }]; // required to make Konva & react-konva work
    return config;
  },
};

export default nextConfig;
