const User = require("../models/User");
const Session = require("../models/Session");
const { stringField, validEmail, validAccount, validStatus, validTopLevelUpdates } = require("../services/validation");

const publicUser = (user) => {
  const value = user?.toObject ? user.toObject() : { ...user };
  if (value) { delete value.email; delete value.__v; }
  return value;
};

exports.checkUserByPhone = async (req, res) => {
  const phoneNumber = req.body?.phoneNumber;
  if (!stringField(phoneNumber, 40)) return res.status(400).json({ message: "Número de telefone inválido." });
  try {
    const user = await User.findOne({ ID: phoneNumber.trim() }).lean();
    return res.json(user ? { exists: true, user: publicUser(user) } : { exists: false });
  } catch (error) { return res.status(500).json({ message: "Erro interno do servidor." }); }
};

exports.checkUserByName = async (req, res) => {
  const userName = req.body?.userName;
  if (!stringField(userName, 40)) return res.status(400).json({ message: "Nome de usuário inválido." });
  try {
    const user = await User.findOne({ name: userName.trim() }).lean();
    return res.json(user ? { exists: true, user: publicUser(user) } : { exists: false });
  } catch (error) { return res.status(500).json({ message: "Erro interno do servidor." }); }
};

exports.checkUserByEmail = async (req, res) => {
  const userEmail = req.body?.userEmail;
  if (!validEmail(userEmail)) return res.status(400).json({ message: "E-mail inválido." });
  try {
    const user = await User.exists({ email: userEmail.trim().toLowerCase() });
    return res.json({ exists: Boolean(user) });
  } catch (error) { return res.status(500).json({ message: "Erro interno do servidor." }); }
};

exports.createAccount = async (req, res) => {
  const dataUser = req.body?.dataUser;
  if (!validAccount(dataUser)) {
    return res.status(400).json({ message: "Nome, e-mail e telefone válidos são obrigatórios." });
  }
  try {
    const conflict = await User.exists({ $or: [{ ID: dataUser.ID.trim() }, { name: dataUser.name.trim() }, { email: dataUser.email.trim().toLowerCase() }] });
    if (conflict) return res.status(409).json({ message: "Telefone, nome ou e-mail já cadastrado." });
    const user = await User.create({ name: dataUser.name.trim(), email: dataUser.email.trim().toLowerCase(), ID: dataUser.ID.trim() });
    return res.status(201).json({ create: true, user: publicUser(user) });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "Telefone já cadastrado." });
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};

exports.updateUserState = async (req, res) => {
  const { ID, ...updates } = req.body || {};
  if (!stringField(ID, 40)) return res.status(400).json({ message: "ID inválido." });
  if (!validTopLevelUpdates(updates)) return res.status(400).json({ message: "Campos de atualização não permitidos." });
  if ("name" in updates && !stringField(updates.name, 40)) return res.status(400).json({ message: "Nome inválido." });
  if ("email" in updates && !validEmail(updates.email)) return res.status(400).json({ message: "E-mail inválido." });
  if ("userState" in updates && (typeof updates.userState !== "string" || updates.userState.length > 80)) return res.status(400).json({ message: "Estado inválido." });
  if ("classe" in updates && !["guerreiro", "arqueiro", "mago"].includes(updates.classe)) return res.status(400).json({ message: "Classe inválida." });
  if ("status" in updates && !validStatus(updates.status)) return res.status(400).json({ message: "Status inválido." });
  try {
    const set = {};
    const unset = {};
    const current = "status" in updates ? await User.findOne({ ID }).select("status.item status.itemMissao").lean() : null;
    for (const [key, value] of Object.entries(updates)) {
      if (key === "status") for (const [statusKey, statusValue] of Object.entries(value)) {
        if (["item", "itemMissao"].includes(statusKey) && statusValue && typeof statusValue === "object") {
          const oldMap = current?.status?.[statusKey] || {};
          for (const oldKey of Object.keys(oldMap)) if (!(oldKey in statusValue)) unset[`status.${statusKey}.${oldKey}`] = "";
          for (const [itemKey, quantity] of Object.entries(statusValue)) set[`status.${statusKey}.${itemKey}`] = quantity;
        } else set[`status.${statusKey}`] = statusValue;
      }
      else set[key] = value;
    }
    const update = {};
    if (Object.keys(set).length) update.$set = set;
    if (Object.keys(unset).length) update.$unset = unset;
    const user = await User.findOneAndUpdate({ ID }, update, { new: true, runValidators: true });
    return user ? res.json({ success: true, user: publicUser(user) }) : res.status(404).json({ message: "Usuário não encontrado." });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "Nome ou e-mail já cadastrado." });
    return res.status(400).json({ message: "Não foi possível validar a atualização." });
  }
};

exports.getSession = async (req, res) => {
  if (!stringField(req.params.phone, 40)) return res.status(400).json({ message: "Telefone inválido." });
  try { return res.json({ session: await Session.findOne({ phone: req.params.phone }).lean() }); }
  catch (error) { return res.status(500).json({ message: "Erro interno do servidor." }); }
};

exports.saveSession = async (req, res) => {
  const { phone, state, battleState } = req.body || {};
  if (!stringField(phone, 40) || typeof state !== "string" || state.length > 80 || !battleState || typeof battleState !== "object" || Array.isArray(battleState)) return res.status(400).json({ message: "Sessão inválida." });
  try {
    const session = await Session.findOneAndUpdate({ phone }, { $set: { state, battleState, updatedAt: new Date() } }, { upsert: true, new: true, runValidators: true });
    return res.json({ success: true, session: session.toObject() });
  } catch (error) { return res.status(500).json({ message: "Erro ao salvar sessão." }); }
};

exports.applyGameAction = async (req, res) => {
  const { ID, action, amount, itemId } = req.body || {};
  if (!stringField(ID, 40) || !["xp", "mana", "item", "regenerate"].includes(action)) return res.status(400).json({ message: "Ação inválida." });
  if (action !== "regenerate" && (!Number.isInteger(amount) || amount <= 0 || amount > 100000)) return res.status(400).json({ message: "Quantidade inválida." });
  try {
    let update;
    if (action === "xp") update = { $inc: { "status.xp": amount } };
    if (action === "mana") update = { $inc: { "status.mana": -amount } };
    if (action === "item") {
      if (!/^[A-Za-z0-9_-]+$/.test(String(itemId))) return res.status(400).json({ message: "Item inválido." });
      update = { $inc: { [`status.item.${itemId}`]: -amount } };
    }
    if (action === "regenerate") update = [{ $set: { "status.hp": { $min: ["$status.maxHP", { $add: ["$status.hp", 1] }] }, "status.mana": { $min: ["$status.maxMana", { $add: ["$status.mana", 1] }] } } }];
    const query = { ID };
    if (action === "mana") query["status.mana"] = { $gte: amount };
    if (action === "item") query[`status.item.${itemId}`] = { $gte: amount };
    const user = await User.findOneAndUpdate(query, update, { new: true, runValidators: true });
    if (!user) return res.status(409).json({ message: "Usuário inexistente ou recursos insuficientes." });
    if (action === "item" && user.status.item.get(String(itemId)) <= 0) {
      await User.updateOne({ ID }, { $unset: { [`status.item.${itemId}`]: "" } });
      user.status.item.delete(String(itemId));
    }
    return res.json({ success: true, user: publicUser(user) });
  } catch (error) { return res.status(500).json({ message: "Falha ao aplicar ação de jogo." }); }
};
