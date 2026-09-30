function createSessionStore(http, baseUrl) {
  return {
    async load(phone) {
      const response = await http.get(`${baseUrl}/sessions/${encodeURIComponent(phone)}`);
      return response.data.session;
    },
    async save(phone, state, battleState) {
      await http.put(`${baseUrl}/sessions`, { phone, state, battleState });
    },
  };
}

module.exports = { createSessionStore };
