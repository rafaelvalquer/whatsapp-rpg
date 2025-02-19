const Character = require("../models/User");

// Busca todos os jogadores no Santuário
async function getPlayersInSantuario() {
    return await Character.find({ "status.santuario": true });
}

// Regenera HP e Mana a cada minuto para jogadores no Santuário
async function regenerarSantuario() {
    try {
        const jogadoresNoSantuario = await getPlayersInSantuario();

        console.log(`Regenerando santuário para ${jogadoresNoSantuario.length} jogadores.`);
        console.log("Resultado da consulta dos usuarios:", jogadoresNoSantuario);

    
        for (const jogador of jogadoresNoSantuario) {
            const hpAntigo = jogador.status.hp;
            const manaAntiga = jogador.status.mana;
            
            // Regenera HP e Mana
            jogador.status.hp = Math.min(jogador.status.hp + 1, jogador.status.maxHP);
            jogador.status.mana = Math.min(jogador.status.mana + 1, jogador.status.maxMana);

                        // Log para mostrar os detalhes do jogador e se houve alteração
                        if (jogador.status.hp > hpAntigo || jogador.status.mana > manaAntiga) {
                            console.log(`Jogador encontrado: ${jogador.name || jogador.ID}`);
                            if (jogador.status.hp > hpAntigo) {
                                console.log(`HP aumentou de ${hpAntigo} para ${jogador.status.hp}`);
                            }
                            if (jogador.status.mana > manaAntiga) {
                                console.log(`Mana aumentou de ${manaAntiga} para ${jogador.status.mana}`);
                            }
                        } else {
                            console.log(`Jogador ${jogador.name || jogador.ID} não teve aumento em HP ou Mana.`);
                        }
            
                        
            await jogador.save(); // Salva as mudanças no banco
        }
    } catch (error) {
        console.error("Erro ao regenerar santuário:", error);
    }
}

module.exports = {
    regenerarSantuario
};
