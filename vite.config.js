export default {
  server: {
    port: 5173,
    // COOP/COEP headers are only needed if you turn on
    // `sharedMemoryForWorkers` in splatLoader.js for faster splat sorting.
    // Left off by default so the project runs anywhere with zero config.
  },
};
