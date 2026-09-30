function createSanctuaryRegenerator(User, logger = console) {
  return async function regenerarSantuario() {
    try {
      const result = await User.updateMany(
        { "status.santuario": true },
        [{ $set: {
          "status.hp": { $cond: [{ $lt: ["$status.hp", "$status.maxHP"] }, { $add: ["$status.hp", 1] }, "$status.hp"] },
          "status.mana": { $cond: [{ $lt: ["$status.mana", "$status.maxMana"] }, { $add: ["$status.mana", 1] }, "$status.mana"] },
        } }]
      );
      if (result.modifiedCount) logger.log(`Santuário regenerou ${result.modifiedCount} jogador(es).`);
    } catch (error) {
      logger.error("Falha na regeneração do Santuário:", error.message);
    }
  };
}

module.exports = { createSanctuaryRegenerator };
