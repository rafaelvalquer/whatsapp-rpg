const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const axios = require("axios");
const BattleSystem = require("./battleSystem");
const missionsData = require("./missions"); // Importa o JSON
const items = require("./armas.json"); // Importa o JSON
const skills = require("./skills.json"); // Importa o JSON
const path = require("path");
const { xpParaProximoNivel, verificarLevelUp } = require("./gameRules");
const { createSessionStore } = require("./sessionStore");
const { serializeByKey } = require("./messageQueue");
const { createApiClient } = require("./apiClient");
const { createNavigationFlow } = require("./navigationFlow");
const { createMessageHandler } = require("./messageHandler");
const API_URL = (process.env.API_URL || "http://localhost:5000/api").replace(/\/$/, "");
const sessionStore = createSessionStore(axios, API_URL);
const api = createApiClient(axios, API_URL);

//#region whatsapp-web.js
// Inicializa o cliente com autenticação local
const client = new Client({
  authStrategy: new LocalAuth(),
});

// Exibe o QR Code no terminal para escanear com o WhatsApp
client.on("qr", (qr) => {
  console.log("QR Code recebido. Escaneie com o app do WhatsApp.");
  qrcode.generate(qr, { small: true });
});

// Evento disparado quando o cliente estiver pronto
client.on("ready", () => {
  console.log("WhatsApp Web conectado com sucesso!");
});

//#region FUNÇÕES
// Função para validar a entrada do usuário
const isValidInput = (input, validOptions) => validOptions.includes(input);

// Função para atualizar o personagem
async function updateCharacter(userData, updates) {
  try {
    const user = await api.updateCharacter(userData, updates);
    return { success: true, user };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

async function updateState(userData, state) {
  const user = userData; // Dados específicos do usuário
  // Define o objeto de atualização com apenas userState
  const update = {
    userState: state,
  };

  // Chama a função para realizar a atualização via API
  const result = await updateCharacter(user, update);

  // Se a atualização foi bem-sucedida, atualize o estado local
  if (result.success) {
    const key = Object.keys(userData).find((chatId) => userData[chatId] === user);
    if (key) userData[key] = result.user;
    return { success: true, user: result.user };
  } else {
    return { success: false, message: result.message };
  }
}

//Função para calcular o proximo nivel do Personagem.
// Progressão extraída para gameRules.
// Função principal para exibir XP
function displayXP(xp, lv) {
  const xpNecessario = xpParaProximoNivel(lv);

  const getXPBar = (xp, xpNecessario) => {
    const filledBars = Math.round((xp / xpNecessario) * 5);
    const emptyBars = 5 - filledBars;
    return "🟨".repeat(filledBars) + "⬜".repeat(emptyBars);
  };

  const playerXPBar = getXPBar(xp, xpNecessario);

  return `🧑 Player XP: ${playerXPBar} ${xp}/${xpNecessario}`;
}

// Função para exibir recuperação do HP e Mana
function displayStatus(currentHP, maxHP, currentMana, maxMana) {
  const getBar = (current, max, filledIcon) => {
    const filledBars = Math.round((current / max) * 5);
    const emptyBars = 5 - filledBars;
    return filledIcon.repeat(filledBars) + "⬜".repeat(emptyBars);
  };

  const hpBar = getBar(currentHP, maxHP, "🟥"); // HP em vermelho
  const manaBar = getBar(currentMana, maxMana, "🟦"); // Mana em azul

  // Cálculo do tempo necessário para recuperação total (1 por minuto)
  const hpFaltando = maxHP - currentHP;
  const manaFaltando = maxMana - currentMana;
  const tempoHP = hpFaltando; // 1 HP por minuto
  const tempoMana = manaFaltando; // 1 Mana por minuto
  const tempoTotal = Math.max(tempoHP, tempoMana); // O maior tempo entre HP e Mana

  let tempoRecuperacao =
    tempoTotal > 0
      ? `⏳ Tempo para recuperação total: ${tempoTotal} minutos.`
      : "✅ HP e Mana já estão no máximo!";

  return (
    `🧑 *Status do Jogador*\n` +
    `❤️ HP: ${hpBar} ${currentHP}/${maxHP}\n` +
    `🔵 Mana: ${manaBar} ${currentMana}/${maxMana}\n\n` +
    `${tempoRecuperacao}`
  );
}

// Função para exibir recuperação do HP e Mana
function displayMana(currentMana, maxMana) {
  const getBar = (current, max, filledIcon) => {
    const filledBars = Math.round((current / max) * 5);
    const emptyBars = 5 - filledBars;
    return filledIcon.repeat(filledBars) + "⬜".repeat(emptyBars);
  };

  const manaBar = getBar(currentMana, maxMana, "🟦"); // Mana em azul

  return (
    `🔵 Mana: ${manaBar} ${currentMana}/${maxMana}`
  )
}

async function updateCharacterStatus(userId, status) {
  const updates = { status };
  const update = await updateCharacter(userData[userId], updates);

  if (update.success) {
      userData[userId] = update.user;
  } else {
      await client.sendMessage(
          userId,
          "❌ Houve um problema ao atualizar seu personagem. Tente novamente."
      );
  }
}


// Função para verificar se a arma do jogador é mais forte que a do inimigo
function displayWeaponStrength(playerWeapon, enemyWeapon) {
  // Calculando o total de atributos de cada arma
  const playerWeaponStrength = calculateWeaponStrength(playerWeapon);
  const enemyWeaponStrength = calculateWeaponStrength(enemyWeapon);

  // Comparando os totais e retornando o símbolo correspondente
  return playerWeaponStrength > enemyWeaponStrength ? `⬆️` : `⬇️`;
}

// Função auxiliar para calcular o poder de uma arma com base em seus atributos
function calculateWeaponStrength(weapon) {
  return weapon.str + weapon.con + weapon.agi + weapon.int;
}


async function verificarInimigoDerrotado(message, battle) {
  try {
    const leveled = await api.gameAction({ ID: userData[message.from].ID, action: "xp", amount: battle.enemy.enemyXP });
    battle.player = leveled;
    userData[message.from] = leveled;
  } catch (error) {
    await client.sendMessage(message.from, "Não foi possível salvar a experiência recebida. Não repita a ação ainda; tente novamente em instantes.");
    return;
  }
  const respostaLevelUp = verificarLevelUp(battle.player);
  battle.player = respostaLevelUp.personagem;
  const XP = displayXP(battle.player.status.xp, battle.player.status.lv);

  await client.sendMessage(
      message.from,
      `${respostaLevelUp.mensagem}\n${XP}`
  );

  if (battle.enemy.arma || battle.enemy.item) {
      const possibilidades = [];
      if (battle.enemy.arma) possibilidades.push("arma");
      if (battle.enemy.item) possibilidades.push("item");
      const evento = possibilidades[Math.floor(Math.random() * possibilidades.length)];

      await updateCharacterStatus(message.from, battle.player.status);
      return navigationFlow.recompensa(message, evento);
  }

  await updateCharacterStatus(message.from, battle.player.status);
  return navigationFlow.batalhaFim(message);
}

//###############################################################
//#region Fluxo de navegação
// Fluxo de navegação

//###############################################################
// FIM Fluxo de navegação
//#endregion

//#region Variaveias Glabais
// Mapeia o estado dos usuários
let userStates = {};

// Mapeia os dados dos usuários
let userData = {};

let battleController = {};

function serializeBattleState(controller) {
  if (!controller) return {};
  const copy = { ...controller };
  if (controller.battle) {
    const battle = controller.battle;
    copy.battle = {
      gridSize: battle.gridSize,
      playerPosition: battle.playerPosition,
      enemyPosition: battle.enemyPosition,
      player: battle.player,
      enemy: battle.enemy,
      buffsAtivos: battle.buffsAtivos || [],
      skillsDisponiveis: battle.skillsDisponiveis,
    };
  }
  return JSON.parse(JSON.stringify(copy));
}

function restoreBattleState(saved, player) {
  const controller = { ...saved };
  if (saved.battle) {
    const data = saved.battle;
    const battlePlayer = data.player || player;
    const battleEnemy = data.enemy;
    const battle = new BattleSystem(data.gridSize, data.playerPosition, battlePlayer, battleEnemy);
    battle.enemyPosition = data.enemyPosition;
    battle.buffsAtivos = data.buffsAtivos || [];
    battle.skillsDisponiveis = data.skillsDisponiveis;
    controller.battle = battle;
  }
  return controller;
}

async function persistSession(chatId) {
  const phone = chatId.split("@")[0];
  const controller = battleController[chatId];
  try {
    await sessionStore.save(phone, userStates[chatId] || "", serializeBattleState(controller));
  } catch (error) {
    console.error("Não foi possível salvar a sessão:", error.message);
  }
}

//#region Evento para receber mensagens
// Evento para receber mensagens
const navigationFlow = createNavigationFlow({ client, userData, userStates, battleController, items, skills, missionsData, BattleSystem, updateCharacter, updateState, displayXP, displayStatus, displayMana, displayWeaponStrength, updateCharacterStatus, verificarLevelUp, isValidInput, MessageMedia, path });

async function repaintPersistedPrompt(message, state) {
  if (["criacaoConta.Usuario", "criacaoConta.Email", "criacaoConta.Conta"].includes(state)) {
    const prompts = {
      "criacaoConta.Usuario": "Digite o nome de usuário:",
      "criacaoConta.Email": "Digite seu e-mail:",
      "criacaoConta.Conta": "Confirme a criação da conta respondendo 1:",
    };
    return message.reply(prompts[state]);
  }
  if (state === "missao") {
    const controller = battleController[message.from];
    const mission = missionsData.missoes[controller?.missao];
    const step = mission?.steps[controller?.step];
    if (step) {
      const options = (step.options || []).map((option, index) => `${index + 1}️⃣ ${option.text}`).join("\n");
      return client.sendMessage(message.from, `${step.text}${options ? `\n${options}` : ""}`);
    }
  }
  if (state.startsWith("recompensa.")) return navigationFlow.recompensa(message, state.split(".")[1]);
  const aliases = {
    "menuInicial.retorno": "menuInicial",
    "quadroDeMissoes.retorna": "quadroDeMissoes",
    "batalha.retorno": "batalha",
    "encontraItem.retorno": "encontraItem",
    "usarItem.retorno": "usarItem",
    "encontraFerido.retorno": "encontraFerido",
    "escolherSkill.retorno": "escolherSkill",
    "escapar.retorno": "escapar",
    "recuperarVida.retorno": "recuperarVida",
    "santuario.retorno": "santuario",
    "usarSkill.retorno": "usarSkill",
  };
  const screen = navigationFlow[aliases[state] || state] || navigationFlow.menuInicial;
  return screen(message);
}

const handleUserResponse = createMessageHandler({ userData, userStates, battleController, client, navigationFlow, items, skills, missionsData, BattleSystem, updateCharacter, updateCharacterStatus, updateState, verificarLevelUp, displayXP, displayMana, displayStatus, displayWeaponStrength, isValidInput, axios, API_URL, api });

client.on("message", async (message) => {
  return processMessage(message.from, message).catch(async (error) => {
    console.error("Falha ao processar mensagem do jogador:", error.message);
    await message.reply("Ocorreu um erro ao processar sua ação. Tente novamente.").catch(() => {});
  });
});

const processMessage = serializeByKey(async (message) => {
  const userState = userStates[message.from];
  const userNumber = message.from.split("@")[0];

  if (!userState || !userData[message.from]) {
    try {
      // Verifica se o usuário está registrado
      const response = await axios.post(
        `${API_URL}/check-number`,
        {
          phoneNumber: userNumber,
        }
      );

      if (response.data.exists) {
        userData[message.from] = response.data.user;
        userStates[message.from] = response.data.user.userState;

        const storedSession = await sessionStore.load(userNumber).catch(() => null);
        if (storedSession) {
          userStates[message.from] = storedSession.state || userStates[message.from];
          if (storedSession.battleState && Object.keys(storedSession.battleState).length) {
            battleController[message.from] = restoreBattleState(storedSession.battleState, userData[message.from]);
          }
        }

        if (userStates[message.from]) {
          await message.reply(
            `${userData[message.from].name}! Vamos retomar de onde paramos?`
          );
          await repaintPersistedPrompt(message, userStates[message.from]);
        } else {
          userData[message.from].userState = "menuInicial";
          await navigationFlow.menuInicial(message);
        }
      } else {
        // Verifica se userData[message.from] já existe, caso contrário, inicializa como um objeto vazio
        if (!userData[message.from]) {
          userData[message.from] = {}; // Inicializa um objeto vazio
        }
        userData[message.from].ID = userNumber;
        userData[message.from].userState = "BoasVindas";
        await navigationFlow.BoasVindas(message);
      }
    } catch (error) {
      console.error("Erro ao verificar o usuário:", error.message);
      await message.reply(
        "Houve um erro ao verificar sua conta. Por favor, tente novamente mais tarde."
      );
    }
  } else {
    await handleUserResponse(message, userState);
  }
  await persistSession(message.from);
});

//#region respostas do usuário
// Lida com as respostas do usuário com base no estado atual

client.initialize();
