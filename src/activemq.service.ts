export async function getQueues() {
  // TODO: integrare Jolokia reale
  return [
    { name: 'TEST.QUEUE', enqueueCount: 10, dequeueCount: 5, consumerCount: 1 }
  ];
}
