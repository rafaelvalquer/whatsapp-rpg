const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true, unique: true, index: true },
    state: { type: String, default: "" },
    battleState: { type: mongoose.Schema.Types.Mixed, default: {} },
    updatedAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 30 },
  },
  { minimize: false }
);

module.exports = mongoose.model("session", SessionSchema);
