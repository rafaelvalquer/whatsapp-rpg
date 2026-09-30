const test = require("node:test");
const assert = require("node:assert/strict");
const { xpParaProximoNivel, verificarLevelUp } = require("../src/gameRules");

function player(xp, classe = "guerreiro") {
  return { classe, status: { lv: 1, xp, maxHP: 30, hp: 10, maxMana: 5, mana: 1, str: 4, con: 3, agi: 2, int: 1, skillPoint: 0 } };
}

test("retains XP below threshold", () => {
  const result = verificarLevelUp(player(99));
  assert.equal(result.personagem.status.lv, 1);
  assert.equal(result.personagem.status.xp, 99);
});

test("levels up at threshold and grants level two skill point", () => {
  const result = verificarLevelUp(player(xpParaProximoNivel(1)));
  assert.equal(result.personagem.status.lv, 2);
  assert.equal(result.personagem.status.skillPoint, 1);
  assert.equal(result.personagem.status.hp, result.personagem.status.maxHP);
});

test("processes multiple levels and retains remainder XP", () => {
  const result = verificarLevelUp(player(1500, "mago"));
  assert.deepEqual(result.gainedLevels, [2, 3, 4]);
  assert.equal(result.personagem.status.xp, 1500 - 100 - 282 - 519);
  assert.equal(result.personagem.status.skillPoint, 1);
});
