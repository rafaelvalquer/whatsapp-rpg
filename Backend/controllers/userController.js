const User = require("../models/User");

//Verifica Se o Usuário está cadastrado na base
exports.checkUserByPhone = async (req, res) => {
    const { phoneNumber } = req.body;

    console.log("Número recebido para verificação:", phoneNumber);

    if (!phoneNumber) {
        return res.status(400).json({ message: "O número de telefone é obrigatório." });
    }

    try {
        // Busca no banco de dados pela coleção 'users' usando o ID
        const user = await User.findOne({ ID: phoneNumber });
        console.log("Resultado da consulta:", user);

        if (user) {
            console.log("Usuário encontrado no banco:", user);
            return res.status(200).json({ exists: true, user: user });
        } else {
            console.log("Nenhum usuário encontrado com este número.");
            return res.status(200).json({ exists: false });
        }
    } catch (error) {
        console.error("Erro ao verificar usuário:", error);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
};

//Verifica Se o Name está cadastrado na base
exports.checkUserByName = async (req, res) => {
    const { userName } = req.body;

    console.log("Nome recebido para verificação:", userName);

    if (!userName) {
        return res.status(400).json({ message: "O nome de usuario é obrigatório." });
    }

    try {
        // Busca no banco de dados pela coleção 'users' usando o name
        const user = await User.findOne({ name: userName });
        console.log("Resultado da consulta:", user);

        if (user) {
            console.log("Usuário encontrado no banco:", user);
            return res.status(200).json({ exists: true, user: user });
        } else {
            console.log("Nenhum usuário encontrado com este número.");
            return res.status(200).json({ exists: false });
        }
    } catch (error) {
        console.error("Erro ao verificar usuário:", error);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
};

//Verifica Se o Email está cadastrado na base
exports.checkUserByEmail = async (req, res) => {
    const { userEmail } = req.body;

    console.log("Email recebido para verificação:", userEmail);

    if (!userEmail) {
        return res.status(400).json({ message: "O nome de usuario é obrigatório." });
    }

    try {
        // Busca no banco de dados pela coleção 'users' usando o name
        const user = await User.findOne({ email: userEmail });
        console.log("Resultado da consulta:", user);

        if (user) {
            console.log("Email encontrado no banco:", user);
            return res.status(200).json({ exists: true});
        } else {
            console.log("Nenhum Usuario encontrado com este email.");
            return res.status(200).json({ exists: false });
        }
    } catch (error) {
        console.error("Erro ao verificar usuário:", error);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
};

// Cria uma nova conta no banco de dados
exports.createAccount = async (req, res) => {
    console.log('body = ' + JSON.stringify(req.body))
    const { dataUser } = req.body; // dataUser contém name, email, e ID

    console.log('dataUser = ' + JSON.stringify(dataUser))
    if (!dataUser || !dataUser.name || !dataUser.email || !dataUser.ID) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }

    try {
        // Cria um novo usuário
        const user = new User({
            name: dataUser.name,
            email: dataUser.email,
            ID: dataUser.ID,
        });

        await user.save();

        console.log("Nova conta criada:", user);
        return res.status(201).json({ create: true, user: user });
    } catch (error) {
        console.error("Erro ao criar conta:", error);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
};


// Atualiza o estado do personagem
exports.updateUserState = async (req, res) => {
    const { ID, ...updates } = req.body;

    // Verifica se todos os campos obrigatórios estão presentes
    if (!ID) {
        return res.status(400).json({ message: "ID, classe, userState e status são obrigatórios." });
    }

    try {
        // Atualiza os dados do usuário no banco de dados
        const updatedUser = await User.findOneAndUpdate(
            { ID }, // Busca pelo ID do usuário
            { $set: updates }, // Atualiza apenas os campos enviados
            { new: true } // Retorna o documento atualizado
        );

        // Verifica se o usuário foi encontrado
        if (!updatedUser) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        console.log("Usuário atualizado com sucesso:", updatedUser);
        return res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
        console.error("Erro ao atualizar o estado do usuário:", error);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
};

// Função que busca todos os jogadores no Santuário
async function getPlayersInSantuario() {
    return await User.find({ santuario : true });
}

// Função que recupera HP/Mana dos jogadores no Santuário
async function regenerarSantuario() {
    try {
        const jogadoresNoSantuario = await getPlayersInSantuario();

        for (const jogador of jogadoresNoSantuario) {
            // Recupera HP e Mana
            jogador.status.hp = Math.min(jogador.status.hp + 1, jogador.status.maxHP);
            jogador.status.mana = Math.min(jogador.status.mana + 1, jogador.status.maxMana);

            // Salva a atualização no banco de dados
            await jogador.save();
        }

        console.log(`Regeneração do Santuário concluída para ${jogadoresNoSantuario.length} jogadores.`);
    } catch (error) {
        console.error("Erro ao regenerar jogadores no Santuário:", error);
    }
}

// Exporta as funções
module.exports = {
    regenerarSantuario
};

