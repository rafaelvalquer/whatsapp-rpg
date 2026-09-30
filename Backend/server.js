require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { getMongoUri } = require("./db");
const userRoutes = require("./routes/userRoutes");
const { regenerarSantuario } = require("./controllers/characterController");

async function start() {
  const app = express();
  app.use(express.json({ limit: "256kb" }));
  app.use("/api", userRoutes);
  app.use((error, req, res, next) => {
    if (error instanceof SyntaxError && "body" in error) return res.status(400).json({ message: "JSON inválido." });
    return next(error);
  });

  await mongoose.connect(getMongoUri());
  console.log("MongoDB conectado.");
  const port = Number(process.env.PORT || 5000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("PORT inválida.");
  const server = app.listen(port, () => console.log(`Servidor rodando na porta ${port}.`));

  const intervalMs = Number(process.env.SANCTUARY_REGENERATION_MS || 60000);
  let regenerationTimer;
  if (intervalMs > 0) {
    regenerationTimer = setInterval(regenerarSantuario, intervalMs);
    regenerationTimer.unref();
  }

  const shutdown = async () => {
    clearInterval(regenerationTimer);
    server.close();
    await mongoose.disconnect();
    process.exit(0);
  };
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
}

start().catch((error) => {
  console.error("Não foi possível iniciar o backend:", error.message);
  process.exitCode = 1;
});
