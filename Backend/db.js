require("dotenv").config();

function getMongoUri() {
  if (process.env.MONGODB_URI) return process.env.MONGODB_URI;

  const { DB_USER, DB_PASSWORD, DB_CLUSTER } = process.env;
  if (!DB_USER || !DB_PASSWORD || !DB_CLUSTER) {
    throw new Error("Configure MONGODB_URI ou DB_USER, DB_PASSWORD e DB_CLUSTER.");
  }

  return `mongodb+srv://${encodeURIComponent(DB_USER)}:${encodeURIComponent(DB_PASSWORD)}@${DB_CLUSTER}/rpgGame?retryWrites=true&w=majority&appName=Cluster0`;
}

module.exports = { getMongoUri };
