function xpParaProximoNivel(level) {
  return Math.floor(100 * level ** 1.5);
}

const growthByClass = {
  guerreiro: { maxHP: 10, maxMana: 2, str: 3, con: 2, agi: 1, int: 1 },
  arqueiro: { maxHP: 6, maxMana: 5, str: 2, con: 1, agi: 3, int: 2 },
  mago: { maxHP: 5, maxMana: 10, str: 1, con: 1, agi: 2, int: 4 },
};

function verificarLevelUp(personagem) {
  const gainedLevels = [];
  let status = personagem.status;

  while (status.xp >= xpParaProximoNivel(status.lv)) {
    const nextLevel = status.lv + 1;
    const growth = growthByClass[personagem.classe] || growthByClass.guerreiro;
    status.xp -= xpParaProximoNivel(status.lv);
    status.lv = nextLevel;
    for (const [key, value] of Object.entries(growth)) {
      status[key] = (status[key] || 0) + value;
    }
    status.hp = status.maxHP;
    status.mana = status.maxMana;
    if (nextLevel % 5 === 0 || nextLevel === 2) status.skillPoint = (status.skillPoint || 0) + 1;
    gainedLevels.push(nextLevel);
  }

  const message = gainedLevels.length
    ? `Parabéns! Você subiu para o nível *${gainedLevels.join(", ")}*! Seus atributos aumentaram e HP/Mana foram recuperados. ${gainedLevels.some((level) => level % 5 === 0 || level === 2) ? "Você recebeu ponto(s) de habilidade! ⚔️\n" : ""}Continue evoluindo! 💪🔥`
    : `Você ainda precisa de *${xpParaProximoNivel(status.lv) - status.xp}* XP para subir de nível.`;

  return { personagem, mensagem: message, gainedLevels };
}

module.exports = { xpParaProximoNivel, verificarLevelUp };
