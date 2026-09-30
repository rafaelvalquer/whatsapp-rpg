function createApiClient(http, baseUrl) {
  return {
    async updateCharacter(user, updates) {
      const response = await http.post(`${baseUrl}/updateUserState`, { ID: user.ID, ...updates });
      if (response.status !== 200 || !response.data.success) throw new Error(response.data.message || "Falha ao atualizar personagem.");
      return response.data.user;
    },
    async gameAction(payload) {
      const response = await http.post(`${baseUrl}/game-action`, payload);
      if (!response.data.success) throw new Error(response.data.message || "Falha na ação do jogo.");
      return response.data.user;
    },
  };
}

module.exports = { createApiClient };
