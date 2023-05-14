const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

module.exports = withPWA({
  basePath: '',
  images: {
    domains: ['images.unsplash.com','travel-tales-s3.s3.amazonaws.com'],
  },
  transpilePackages: ['@ionic/react', '@ionic/core', '@stencil/core', 'ionicons'],
  swcMinify: true,
});