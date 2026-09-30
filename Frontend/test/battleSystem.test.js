const test = require("node:test");
const assert = require("node:assert/strict");
const BattleSystem = require("../src/battleSystem");

function battle() {
  const player = { name: "Hero", classe: "guerreiro", status: { str: 8, con: 2, agi: 2, int: 1, hp: 30, maxHP: 30, mana: 20, arma1: 0, arma2: 0 } };
  const enemy = { enemyName: "Goblin", enemyHP: 40, enemyMaxHP: 40, enemyStr: 4, enemyCon: 2, position: 1, enemyXP: 5 };
  return new BattleSystem(8, 0, player, enemy);
}

test("temporary attribute buffs do not mutate base stats and expire on tick", () => {
  const combat = battle();
  combat.buffsAtivos = [{ nome: "Força", efeito: "str", valor: 3, duracao: 1 }];
  combat.playerAttack();
  assert.equal(combat.enemy.enemyHP, 31);
  assert.equal(combat.player.status.str, 8);
  assert.equal(combat.tickBuffs().length, 1);
  assert.equal(combat.getBuff("str"), 0);
});

test("burning is applied once when requested", () => {
  const combat = battle();
  combat.buffsAtivos = [{ nome: "Queimadura", efeito: "queimadura", valor: 2, duracao: 3 }];
  combat.applyBuffs(combat.buffsAtivos[0]);
  assert.equal(combat.enemy.enemyHP, 38);
});

test("enemy defense buff affects damage without changing the base attribute", () => {
  const combat = battle();
  combat.buffsAtivos = [{ nome: "Defesa", efeito: "reduzirDano", valor: 2, duracao: 2 }];
  combat.enemyAction();
  assert.equal(combat.player.status.hp, 29);
  assert.equal(combat.player.status.con, 2);
});
