const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/check-number", userController.checkUserByPhone);
router.post("/check-user", userController.checkUserByName);
router.post("/check-email", userController.checkUserByEmail);
router.post("/create-account", userController.createAccount);
router.post("/updateUserState", userController.updateUserState);
router.get("/sessions/:phone", userController.getSession);
router.put("/sessions", userController.saveSession);
router.post("/game-action", userController.applyGameAction);

module.exports = router;
