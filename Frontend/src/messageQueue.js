function serializeByKey(handler) {
  const queues = new Map();
  return (key, value) => {
    const previous = queues.get(key) || Promise.resolve();
    const current = previous.catch(() => {}).then(() => handler(value));
    queues.set(key, current);
    return current.finally(() => {
      if (queues.get(key) === current) queues.delete(key);
    });
  };
}

module.exports = { serializeByKey };
