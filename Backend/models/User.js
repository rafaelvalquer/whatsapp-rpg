const mongoose = require("mongoose");

// Subschema para o campo 'status'
const StatusSchema = new mongoose.Schema({
  lv: {
    type: Number,
    default: 1,
  },
  xp: {
    type: Number,
    default: 0,
  },
  maxHP: {
    type: Number,
    default: 0,
  },
  hp: {
    type: Number,
    default: 0,
  },
  maxMana: {
    type: Number,
    default: 0,
  },
  mana: {
    type: Number,
    default: 0,
  },
  str: {
    type: Number,
    default: 0,
  },
  con: {
    type: Number,
    default: 0,
  },
  agi: {
    type: Number,
    default: 0,
  },
  int: {
    type: Number,
    default: 0,
  },
  ouro: {
    type: Number,
    default: 0,
  },
  arma1: {
    type: Number,
    default: 0,
  },
  arma2: {
    type: Number,
    default: 0,
  },
  armadura: {
    type: Number,
    default: 0,
  },
  item: {
    type: Map, // Usando Map para permitir um objeto chave-valor
    of: Number, // Os valores serão números (ex.: quantidades de itens)
  },
  itemMissao: {
    type: Map, // Usando Map para permitir um objeto chave-valor
    of: Number, // Os valores serão números (ex.: quantidades de itens)
  },
  skillPoint: {
    type: Number,
    default: 0,
  },
  skills: {
    type: [Number], // Array de números (IDs das skills)
    default: [], // Valor padrão como um array vazio
  },
  santuario: {
    type: Boolean,
    default: false, // Inicialmente, o jogador não está no santuário
  },
});

const UsuarioSchema = new mongoose.Schema({
  ID: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  classe: {
    type: String,
  },
  status: {
    type: StatusSchema,
    default: () => ({}), // Define um valor padrão como um objeto vazio
  },
  userState: {
    type: String,
  }
});

module.exports = mongoose.model("users", UsuarioSchema);
