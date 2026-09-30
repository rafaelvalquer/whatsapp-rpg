const test = require("node:test");
const assert = require("node:assert/strict");
const { createSessionStore } = require("../src/sessionStore");

test("session store reads and writes persistent battle snapshots", async () => {
  const calls = [];
  const http = {
    get: async (url) => { calls.push(["get", url]); return { data: { session: { state: "batalha.retorno", battleState: { step: 2 } } } }; },
    put: async (url, body) => { calls.push(["put", url, body]); return { data: { success: true } }; },
  };
  const store = createSessionStore(http, "http://api/api");
  const loaded = await store.load("5511");
  await store.save("5511", loaded.state, loaded.battleState);
  assert.equal(calls[0][1], "http://api/api/sessions/5511");
  assert.deepEqual(calls[1][2], { phone: "5511", state: "batalha.retorno", battleState: { step: 2 } });
});
