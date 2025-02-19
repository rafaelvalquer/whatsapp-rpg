const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Rota para verificar usuário por telefone
router.post("/checkUserByPhone", userController.checkUserByPhone);

// Rota para verificar usuário por nome
router.post("/checkUserByName", userController.checkUserByName);

// Rota para verificar usuário por email
router.post("/checkUserByEmail", userController.checkUserByEmail);

// Rota para criar um novo usuário
router.post("/createAccount", userController.createAccount);

// Rota para atualizar o estado do usuário
router.post("/updateUserState", userController.updateUserState);

module.exports = router;
