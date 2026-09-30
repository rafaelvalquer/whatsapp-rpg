const allowedTopLevel = new Set(["name", "email", "classe", "status", "userState"]);
const allowedStatus = new Set(["lv", "xp", "maxHP", "hp", "maxMana", "mana", "str", "con", "agi", "int", "ouro", "arma1", "arma2", "armadura", "item", "itemMissao", "skillPoint", "skills", "santuario"]);

function stringField(value, max = 100) {
  return typeof value === "string" && value.trim().length > 0 && value.trim().length <= max;
}

function validEmail(value) {
  return stringField(value, 254) && /^\S+@\S+\.\S+$/.test(value.trim());
}

function validAccount(data) {
  return Boolean(data && stringField(data.name, 40) && stringField(data.ID, 40) && validEmail(data.email));
}

function validStatus(status) {
  if (!status || typeof status !== "object" || Array.isArray(status)) return false;
  if (Object.keys(status).some((key) => !allowedStatus.has(key))) return false;
  const numeric = ["lv", "xp", "maxHP", "hp", "maxMana", "mana", "str", "con", "agi", "int", "ouro", "arma1", "arma2", "armadura", "skillPoint"];
  for (const key of numeric) if (key in status && (!Number.isFinite(status[key]) || status[key] < 0)) return false;
  for (const key of ["item", "itemMissao"]) {
    if (key in status && (!status[key] || typeof status[key] !== "object" || Array.isArray(status[key]) || Object.entries(status[key]).some(([id, count]) => !/^[A-Za-z0-9_-]+$/.test(id) || (key === "item" ? !Number.isInteger(count) || count < 0 : typeof count !== "boolean" && (!Number.isFinite(count) || count < 0))))) return false;
  }
  if ("skills" in status && (!Array.isArray(status.skills) || status.skills.some((id) => !Number.isInteger(id) || id < 0))) return false;
  if ("santuario" in status && typeof status.santuario !== "boolean") return false;
  return true;
}

function validTopLevelUpdates(updates) {
  const keys = Object.keys(updates || {});
  return keys.length > 0 && keys.every((key) => allowedTopLevel.has(key));
}

module.exports = { stringField, validEmail, validAccount, validStatus, validTopLevelUpdates };
