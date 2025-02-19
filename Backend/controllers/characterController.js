const Character = require("../models/User");

// Busca todos os jogadores no Santuário
async function getPlayersInSantuario() {
    return await Character.find({ "status.santuario": true });
}

// Regenera HP e Mana a cada minuto para jogadores no Santuário
async function regenerarSantuario() {
    try {
        const jogadoresNoSantuario = await getPlayersInSantuario();
    
        for (const jogador of jogadoresNoSantuario) {
            jogador.status.hp = Math.min(jogador.status.hp + 1, jogador.status.hpMax);
            jogador.status.mana = Math.min(jogador.status.mana + 1, jogador.status.manaMax);
            
            await jogador.save(); // Salva as mudanças no banco
        }
    } catch (error) {
        console.error("Erro ao regenerar santuário:", error);
    }
}

module.exports = {
    regenerarSantuario
};
