import client from 'prom-client';

// Create a Registry to register the metrics
const register = new client.Registry();
client.collectDefaultMetrics({
  labels: {NODE_APP_INSTANCE: 'graphql-performance'},
  gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5],
  register,
});

const counter = new client.Counter({
  name: 'node_request_operation_total',
  help: 'The total number of processed requests.',
});

const histogram = new client.Histogram({
  name: 'node_request_duration_seconds',
  help: 'Histogram for the duration in seconds.',
  buckets: [1, 2, 5, 6, 10],
});

export {client,counter, histogram};
