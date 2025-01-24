const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dbConfig = require("./db");
const userRoutes = require("./routes/userRoutes"); // Importe as rotas do usuário

const app = express();
app.use(bodyParser.json());

// Conectar ao MongoDB
mongoose
    .connect(dbConfig.uri)
    .then(() => console.log("MongoDB conectado com sucesso!"))
    .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));

// Adicionar as rotas de usuário com o prefixo /api
app.use("/api", userRoutes);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
