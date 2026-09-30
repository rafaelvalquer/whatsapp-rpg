const test = require("node:test");
const assert = require("node:assert/strict");
const { serializeByKey } = require("../src/messageQueue");

test("serializes messages per player while allowing independent players", async () => {
  const active = new Map();
  let overlap = false;
  const queue = serializeByKey(async ({ key, delay }) => {
    const count = active.get(key) || 0;
    if (count) overlap = true;
    active.set(key, count + 1);
    await new Promise((resolve) => setTimeout(resolve, delay));
    active.set(key, active.get(key) - 1);
  });
  await Promise.all([queue("A", { key: "A", delay: 20 }), queue("A", { key: "A", delay: 5 }), queue("B", { key: "B", delay: 5 })]);
  assert.equal(overlap, false);
});
