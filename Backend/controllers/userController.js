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




