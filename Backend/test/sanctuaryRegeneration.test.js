const test = require("node:test");
const assert = require("node:assert/strict");
const { createSanctuaryRegenerator } = require("../services/sanctuaryRegeneration");

test("sanctuary uses a bounded atomic update for players in sanctuary", async () => {
  let call;
  const logs = [];
  const User = { updateMany: async (...args) => { call = args; return { modifiedCount: 2 }; } };
  await createSanctuaryRegenerator(User, { log: (value) => logs.push(value), error() {} })();
  assert.equal(call[0]["status.santuario"], true);
  assert.ok(call[1][0].$set["status.hp"].$cond);
  assert.equal(logs.length, 1);
});

test("regeneration reports database failures without throwing", async () => {
  const errors = [];
  const User = { updateMany: async () => { throw new Error("db down"); } };
  await createSanctuaryRegenerator(User, { log() {}, error: (...args) => errors.push(args) })();
  assert.equal(errors.length, 1);
});
