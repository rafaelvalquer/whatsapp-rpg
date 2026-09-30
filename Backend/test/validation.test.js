const test = require("node:test");
const assert = require("node:assert/strict");
const { validAccount, validEmail, validStatus, validTopLevelUpdates } = require("../services/validation");

test("accepts valid account and email data", () => {
  assert.equal(validAccount({ ID: "5511", name: "Hero", email: "hero@example.com" }), true);
  assert.equal(validEmail("not-an-email"), false);
});

test("rejects unsupported status fields and invalid values", () => {
  assert.equal(validStatus({ hp: -1 }), false);
  assert.equal(validStatus({ hp: 10, unexpected: true }), false);
  assert.equal(validStatus({ hp: 10, item: { "bad.path": 1 } }), false);
});

test("only accepts known top-level update fields", () => {
  assert.equal(validTopLevelUpdates({ userState: "menuInicial" }), true);
  assert.equal(validTopLevelUpdates({ isAdmin: true }), false);
  assert.equal(validTopLevelUpdates({}), false);
});
