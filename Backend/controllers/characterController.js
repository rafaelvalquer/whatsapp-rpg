const User = require("../models/User");
const { createSanctuaryRegenerator } = require("../services/sanctuaryRegeneration");

module.exports = { regenerarSantuario: createSanctuaryRegenerator(User) };
