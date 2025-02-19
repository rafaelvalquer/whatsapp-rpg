const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");



router.post("/check-number", userController.checkUserByPhone);
router.post("/check-user", userController.checkUserByName);
router.post("/check-email", userController.checkUserByEmail);
router.post("/create-account", userController.createAccount);
router.post("/updateUserState", userController.updateUserState);

module.exports = router;
