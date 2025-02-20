const { Client, LocalAuth, Buttons } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const axios = require("axios");
const BattleSystem = require("./battleSystem");
const missionsData = require("./missions"); // Importa o JSON
const items = require("./armas.json"); // Importa o JSON
const skills = require("./skills.json"); // Importa o JSON

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
    // Realiza a requisição para atualizar o personagem
    const response = await axios.post(
      "http://localhost:5000/api/updateUserState",
      {
        ID: userData.ID,
        ...updates, // Mescla as atualizações passadas na chamada da função
      }
    );

    // Verifica o sucesso da operação
    if (response.status === 200 && response.data.success) {
      console.log("Personagem atualizado com sucesso:", response.data.user);
      return { success: true, user: response.data.user };
    } else {
      console.error("Falha ao atualizar o personagem:", response.data.message);
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    console.error("Erro ao atualizar o personagem:", error.message);
    return { success: false, message: error.message };
  }
}

async function updateState(userData, state) {
  const user = userData; // Dados específicos do usuário
  // Define o objeto de atualização com apenas userState
  const update = {
    userState: state,
  };

  console.log(update);

  // Chama a função para realizar a atualização via API
  const result = await updateCharacter(user, update);

  // Se a atualização foi bem-sucedida, atualize o estado local
  if (result.success) {
    console.log(`Estado do usuário atualizado para: ${state}`);
    return { success: true, user: result.user };
  } else {
    console.error(`Falha ao atualizar o estado do usuário: ${result.message}`);
    return { success: false, message: result.message };
  }
}

//Função para calcular o proximo nivel do Personagem.
function xpParaProximoNivel(level) {
  const baseXP = 100;
  const factor = 1.5;
  return Math.floor(baseXP * level ** factor);
}

function verificarLevelUp(personagem) {
  const xpNecessario = xpParaProximoNivel(personagem.status.lv);

  if (personagem.status.xp >= xpNecessario) {
    personagem.status.lv += 1;
    personagem.status.xp -= xpNecessario; // Subtrai o XP usado

    let mensagem = `Parabéns! Você subiu para o nível *${personagem.status.lv}*! 🎉
Seus status aumentaram:`;

    if (personagem.classe == "guerreiro") {
      mensagem += `🔹 Vida (HP): ${personagem.status.maxHP} ➡️ ${personagem.status.maxHP + 10}
🔹 Mana (MANA): ${personagem.status.maxMana} ➡️ ${personagem.status.maxMana + 2}
🔹 Força (STR): ${personagem.status.str} ➡️ ${personagem.status.str + 3}
🔹 Resistência (CON): ${personagem.status.con} ➡️ ${personagem.status.con + 2}
🔹 Agilidade (AGI): ${personagem.status.agi} ➡️ ${personagem.status.agi +1}
🔹 Inteligência (INT): ${personagem.status.int} ➡️ ${personagem.status.int + 1}
`
      personagem.status.maxHP += 10; // Aumenta HP ao subir de nível
      personagem.status.hp = personagem.status.maxHP; // Recupera todo HP
      personagem.status.maxMana += 2; // Pouca mana, usada para golpes especiais
      personagem.status.mana = personagem.status.maxMana; // Recupera toda Mana
      personagem.status.str += 3; // Aumenta força
      personagem.status.con += 2; // Aumenta defesa
      personagem.status.agi += 1; // Aumenta agilidade
      personagem.status.int += 1; // Aumenta inteligência (leve crescimento)

    } else if (personagem.classe == "arqueiro") {
      mensagem += `🔹 Vida (HP): ${personagem.status.maxHP} ➡️ ${personagem.status.maxHP + 6}
🔹 Mana (MANA): ${personagem.status.maxMana} ➡️ ${personagem.status.maxMana + 5}
🔹 Força (STR): ${personagem.status.str} ➡️ ${personagem.status.str + 2}
🔹 Resistência (CON): ${personagem.status.con} ➡️ ${personagem.status.con + 1}
🔹 Agilidade (AGI): ${personagem.status.agi} ➡️ ${personagem.status.agi + 3}
🔹 Inteligência (INT): ${personagem.status.int} ➡️ ${personagem.status.int + 2}
`;

      personagem.status.maxHP += 6; // Aumenta HP, mas menos que o guerreiro
      personagem.status.hp = personagem.status.maxHP;
      personagem.status.maxMana += 5; // Mana razoável para habilidades especiais
      personagem.status.mana = personagem.status.maxMana; // Recupera toda Mana
      personagem.status.str += 2; // Aumenta força moderadamente
      personagem.status.con += 1; // Pouco aumento na defesa
      personagem.status.agi += 3; // Agilidade é o foco principal
      personagem.status.int += 2; // Inteligência cresce um pouco para habilidades de mira/tática

    } else if (personagem.classe == "mago") {
      mensagem += `🔹 Vida (HP): ${personagem.status.maxHP} ➡️ ${personagem.status.maxHP + 5}
🔹 Mana (MANA): ${personagem.status.maxMana} ➡️ ${personagem.status.maxMana + 10}
🔹 Força (STR): ${personagem.status.str} ➡️ ${personagem.status.str + 1}
🔹 Resistência (CON): ${personagem.status.con} ➡️ ${personagem.status.con + 1}
🔹 Agilidade (AGI): ${personagem.status.agi} ➡️ ${personagem.status.agi + 2}
🔹 Inteligência (INT): ${personagem.status.int} ➡️ ${personagem.status.int + 4}
      `;
      personagem.status.maxHP += 5; // HP cresce pouco, pois mago é frágil
      personagem.status.hp = personagem.status.maxHP;
      personagem.status.maxMana += 10; // Alto crescimento de mana para feitiços
      personagem.status.mana = personagem.status.maxMana; // Recupera toda Mana
      personagem.status.str += 1; // Pouca força, não é o foco
      personagem.status.con += 1; // Pouca defesa, pois mago depende de magia
      personagem.status.agi += 2; // Mais ágil que guerreiro, menos que arqueiro
      personagem.status.int += 4; // Inteligência cresce muito, pois é o atributo principal
    }

    // Adiciona a mensagem de escolha de skill se o nível for divisível por 5
    if (personagem.status.lv % 5 === 0) {
      personagem.status.skillPoint ++; // 
      mensagem += `Parabéns! Você pode aprender uma nova *skill.* ⚔️\n`;
    }

    mensagem += "Parabéns! Continue evoluindo! 💪🔥"
    return {
      personagem,
      mensagem: mensagem,
    };
  }

  return {
    personagem,
    mensagem: `Você ainda precisa de *${
      xpNecessario - personagem.status.xp
    }* XP para subir de nível.`,
  };
}

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

  let tempoRecuperacao = tempoTotal > 0 
    ? `⏳ Tempo para recuperação total: ${tempoTotal} minutos.` 
    : "✅ HP e Mana já estão no máximo!";

  return `🧑 *Status do Jogador*\n` +
         `❤️ HP: ${hpBar} ${currentHP}/${maxHP}\n` +
         `🔵 Mana: ${manaBar} ${currentMana}/${maxMana}\n\n` +
         `${tempoRecuperacao}`;
}



//###############################################################
//#region Fluxo de navegação
// Fluxo de navegação
const navigationFlow = {
  BoasVindas: async (message) => {
    const options = `Você é novo por aqui, escolha uma das opções:
1. Criar uma conta
2. Encerrar`;

    await message.reply(options);
    userStates[message.from] = "BoasVindas";
  },

  criacaoConta: async (message) => {
    await message.reply("Digite o nome de usuário:");
    userStates[message.from] = "criacaoConta.Usuario";
  },
  configuracaoPersonagem: async (message) => {
    await client.sendMessage(
      message.from,
      `Certo ${
        userData[message.from].name
      }! Vamos seguir para escolha da sua classe.`
    );

    const options = `1 – Guerreiro 🗡️  
Status iniciais:
HP: 30
Mana: 5
Força (STR): 4  
Resistência (CON): 3  
Agilidade (AGI): 2  
Inteligência (INT): 1  

▶️ O Guerreiro é um combatente corpo a corpo, precisando estar ao lado do inimigo para atacar.  
Ele causa alto dano físico com base em sua Força (STR) e pode equipar armas pesadas para aumentar seu ataque.  

2 – Arqueiro 🏹  
HP: 25
Mana: 10
Status iniciais:  
Força (STR): 2  
Resistência (CON): 2  
Agilidade (AGI): 5  
Inteligência (INT): 1  

▶️ O Arqueiro pode atacar de longe, utilizando sua Agilidade (AGI) para causar dano.  
Se o inimigo estiver muito próximo, ele usará a Força (STR) para atacar e Resistência (CON) para se defender.  

3 – Mago 🔥  
Status iniciais:  
HP: 20
Mana: 30
Força (STR): 1  
Resistência (CON): 2  
Agilidade (AGI): 1  
Inteligência (INT): 6  

▶️ O Mago ataca à distância, usando sua Inteligência (INT) para lançar feitiços poderosos.  
Se o inimigo estiver muito perto, ele terá que usar a Força (STR) para atacar e Resistência (CON) para se defender, mas é frágil em combate corpo a corpo.`;

    await client.sendMessage(message.from, options);
    userStates[message.from] = "configuracaoPersonagem.retorno";
  },
  inicio: async (message) => {
    await client.sendMessage(
      message.from,
      `Vamos dar inicio a sua história! Boa sorte ${
        userData[message.from].name
      }.`
    );
    navigationFlow.menuInicial(message);
  },

  menuInicial: async (message) => {
    const result = await updateState(userData[message.from], "menuInicial"); // Atualiza no banco e localmente

    if (result.success) {
      Object.assign(userData[message.from], result.user); // Atualiza os dados do personagem localmente

      await client.sendMessage(
        message.from,
        `🌍 ${
          userData[message.from].name
        }, bem-vindo ao mundo! 🌟 Qual é o seu próximo destino?`
      );

      // Exibe as opções do menu
      await client.sendMessage(
        message.from,
        `Escolha uma das opções:
    1️⃣. 🏹 Iniciar Missões
    2️⃣. ❤️ Recuperar Vida
    3️⃣. 🛒 Comprar Itens
    4️⃣. 📊 Verificar Status
    5️⃣. ❓ FAQ`
      );

      // Atualiza o estado interno do userStates para controle local
      userStates[message.from] = "menuInicial.retorno";
      console.log("chegar aqui = " + userStates[message.from]);
    } else {
      client.sendMessage(
        message.from,
        "Houve um problema. Por favor, tente novamente mais tarde."
      );
      navigationFlow.inicio(message);
    }
  },

  quadroDeMissoes: async (message) => {
    const result = await updateState(userData[message.from], "quadroDeMissoes"); // Atualiza no banco e localmente

    battleController[message.from] = {}; // Cria o controle de batalha

    if (result.success) {
      Object.assign(userData[message.from], result.user); // Atualiza os dados do personagem localmente

      // Mensagem de introdução ao menu de missões
      await client.sendMessage(
        message.from,
        `Você chega a um quadro de avisos no centro da vila 🏘️, onde estão listadas missões disponíveis 📜. 
Cada uma delas promete desafios e recompensas 🌟.
Escolha uma missão para iniciar a sua jornada 🗺️:`
      );

      // Exibe as missões disponíveis
      let missionsMessage = "Missões disponíveis:\n";
      missionsData.missoes.forEach((mission) => {
        missionsMessage += `\n${mission.id}. *${mission.name}*\n📜 ${mission.description}\n⚔️ Dificuldade: ${mission.difficulty}\n`;
      });
      missionsMessage += `\n0. Voltar ao menu.`;

      await client.sendMessage(message.from, missionsMessage);

      // Atualiza o estado interno para aguardar a escolha da missão
      userStates[message.from] = "quadroDeMissoes.retorna";
    } else {
      client.sendMessage(
        message.from,
        "Houve um problema. Por favor, tente novamente mais tarde."
      );
      navigationFlow.inicio(message);
    }
  },

  batalha: async (message) => {
    if (!battleController[message.from].battle) {
      const enemy = battleController[message.from].enemy;

      await client.sendMessage(
        message.from,
        `${userData[message.from].name} prepare-se para a batalha! 🔥`
      );
      battleController[message.from].battle = new BattleSystem(
        6,
        0,
        userData[message.from],
        enemy
      ); // Inicialize o sistema de batalha com um grid de 6 posições
      const battle = battleController[message.from].battle;

      // Exibir o grid inicial
      await message.reply(`Estado inicial:\n${battle.displayGrid()}`);
    }
    let txt = `Escolha uma das opções:
1. Avançar
2. Atacar
3. Recuar
4. Skill`;

    if(Object.keys(userData[message.from].status.item).length > 0){
      txt += `
5. Usar item`
    } else {
      txt += `
5. Nenhum item disponível!`
    }

    txt += `
0. Escapar`;


    await client.sendMessage(message.from, txt );

    userStates[message.from] = "batalha.retorno"; // Atualize corretamente o estado
    console.log("Estado atualizado:", JSON.stringify(userStates, null, 2)); // Log final para validar
  },
  batalhaFim: async (message) => {
    delete battleController[message.from].battle;
    delete battleController[message.from].enemy;

    const mission = structuredClone(
      missionsData.missoes[battleController[message.from].missao]
    );
    const step = battleController[message.from].step;
    let optionsText = "";

    mission.steps[step].options.forEach((option, index) => {
      optionsText += `${index + 1}. ${option.text}\n`;
    });

    client.sendMessage(message.from, mission.steps[step].text);
    await client.sendMessage(message.from, optionsText);

    userStates[message.from] = "missao";
  },

  encontraItemFim: async (message) => {
    delete battleController[message.from].item;

    const mission = structuredClone(
      missionsData.missoes[battleController[message.from].missao]
    );
    const step = battleController[message.from].step;
    let optionsText = "";

    mission.steps[step].options.forEach((option, index) => {
      optionsText += `${index + 1}. ${option.text}\n`;
    });

    client.sendMessage(message.from, mission.steps[step].text);
    await client.sendMessage(message.from, optionsText);

    userStates[message.from] = "missao";
  },

  recompensa: async (message, evento) => {
    const battle = battleController[message.from].battle;

    if (evento == "arma") {
      const frase = `📜 Atributos do ${items[battle.enemy.arma].nome}:

🗡 Força: +[${items[battle.enemy.arma].str}]
🛡 Resistência: +[${items[battle.enemy.arma].con}]
🎯 Agilidade: +[${items[battle.enemy.arma].agi}]
📖 Inteligência: +[${items[battle.enemy.arma].int}]
🎒 Armas atuais:
🔹 Mão Direita: [${(items[userData[message.from]?.status?.arma1] || { nome: 'Vazio' }).nome}]
🔹 Mão Esquerda: [${(items[userData[message.from]?.status?.arma2] || { nome: 'Vazio' }).nome}]`;

const opcoes = `⚔️ O que deseja fazer?
1️⃣ Trocar a Mão Direita
2️⃣ Trocar a Mão Esquerda
3️⃣ Deixar a arma no local`;

      await client.sendMessage(message.from, `Ao revirar os restos do ${battle.enemy.enemyName}, você descobre um *${items[battle.enemy.arma].nome}*.`);
      await client.sendMessage(message.from, frase);
      await client.sendMessage(message.from, opcoes);
      userStates[message.from] = "recompensa.arma";
    
    } else if (evento == "item") {
      await client.sendMessage(message.from, `Ao revirar os restos do ${battle.enemy.enemyName}, você descobre um *${items[battle.enemy.item].nome}*.`);
      await client.sendMessage(
        message.from,
        `O que deseja fazer?  
    1️⃣ Usar agora  
    2️⃣ Guardar para mais tarde`
      );

      userStates[message.from] = "recompensa.item";
    }

  },

  encontraItem: async (message) => {

      const item = battleController[message.from].item;
      await client.sendMessage(
        message.from,
        `📜 "Você encontrou uma ${items[item].nome}${items[item].emoji}! ${items[item].txt}."`
      );

      if (items[item].tipo == "missao"){
        await client.sendMessage(
          message.from,
          `1️⃣ Guardar para mais tarde`);
      }else {
        await client.sendMessage(
          message.from,
          `O que deseja fazer?  
  1️⃣ Usar agora  
  2️⃣ Guardar para mais tarde`);
      }


      userStates[message.from] = "encontraItem.retorno"; // Atualize corretamente o estado
    
  },

  usarItem: async (message) => {

    let txtItem = `🎒 *Inventário de Itens*\n\n`;
    txtItem += "Qual item deseja usar? Digite o número correspondente:\n\n";
    txtItem += Object.entries(userData[message.from].status.item)
    .map(([id, quantidade], index) => `*${index + 1}.* ${items[id].nome} ${items[id].emoji}  (x${quantidade})`)
    .join("\n");

    await client.sendMessage(message.from, txtItem);

    userStates[message.from] = "usarItem.retorno"; // Atualize corretamente o estado
  
},

encontraFerido: async (message) => {

  await client.sendMessage(
    message.from,
    battleController[message.from].nextText
  );

  await client.sendMessage(
    message.from,
    `O que deseja fazer?  
1️⃣ Resgatar o *${battleController[message.from].enemy.enemyName}*  
2️⃣ Ignorar e seguir seu caminho`
  );

  userStates[message.from] = "encontraFerido.retorno"; // Atualize corretamente o estado

},

missaoFim: async (message) => {

  const recompensa = battleController[message.from].recompensa;
  
  // Criar uma cópia do status do usuário antes de modificar
  let playerCopy = structuredClone(userData[message.from]);

  if(recompensa?.xp){
    playerCopy.status.xp += recompensa.xp;
    const respostaLevelUp = verificarLevelUp(playerCopy); // Verificar se o personagem pulou de LV
    playerCopy = respostaLevelUp.personagem;
    const XP = displayXP(playerCopy.status.xp, playerCopy.status.lv);
    await client.sendMessage(message.from, respostaLevelUp.mensagem + `\n${XP}`);

        // Atualizar Personagem no banco de dados
        let updates = { status: playerCopy.status };
        const updateResult = await updateCharacter(userData[message.from], updates);

      if (updateResult.success) {
        await client.sendMessage(
          message.from,
          "Personagem atualizado com sucesso no banco"
        );

        // Atualizar o userData com os novos dados
        userData[message.from].status = updateResult.user.status;
      } else {
        await client.sendMessage(
          message.from,
          "Houve um problema ao atualizar seu personagem. Por favor, tente novamente."
        );
      }

  }
  await client.sendMessage(
    message.from,
 "🏡 Com a missão concluída, você retorna ao vilarejo para descansar e compartilhar sua história."
  );

  navigationFlow.menuInicial(message);
},

escolherSkill: async (message) => {

  const classe = userData[message.from].classe;
  const nivel = userData[message.from].status.lv;

  let prefixo = "";

  switch (classe) {
    case "guerreiro":
      prefixo = "1";
      break;
    case "arqueiro":
      prefixo = "2";
      break;
    case "mago":
      prefixo = "3";
      break;
    default:
      return "Classe inválida.";
  }

  // Filtra as skills disponíveis com base no prefixo e nível do jogador
  const skillsDisponiveis = Object.entries(skills)
    .filter(([id, skill]) => id.startsWith(prefixo) && skill.lv == nivel);

    battleController[message.from].battle.skillsDisponiveis = skillsDisponiveis;

  if (skillsDisponiveis.length === 0) {
    await client.sendMessage(message.from, "Nenhuma habilidade disponível no momento.");
  }

  // Formata a mensagem de seleção de habilidades
  let txtSkill = `🛡️ *Escolha sua Nova Habilidade*\n\n`;
  txtSkill += "Digite o número correspondente à skill que deseja aprender:\n\n";

  txtSkill += skillsDisponiveis
    .map(([id, skill], index) => 
      `*${index + 1}.* ${skill.nome} ⚔️ (${skill.tipo})\n📜 ${skill.descricao}\n💠 *Custo:* ${skill.custo} Mana\n`
    )
    .join("\n");

  await client.sendMessage(message.from, txtSkill);

  userStates[message.from] = "escolherSkill.retorno"; // Atualize corretamente o estado
},

escapar: async (message) => {
  // Formata a mensagem de seleção de habilidades
  let txt = `🏃‍♂️Você escolheu escapar. Ao fugir, você abandona a missão e deixa para trás as responsabilidades e desafios que ainda estavam por vir. A segurança é prioridade, mas a missão permanece incompleta. ⚠️\n`;
  txt += "1️⃣ Escapar\n2️⃣ Voltar para a batalha";


  await client.sendMessage(message.from, txt);

  userStates[message.from] = "escapar.retorno"; // Atualize corretamente o estado
},

recuperarVida: async (message) => {
  const result = await updateState(userData[message.from], "recuperarVida"); // Atualiza no banco e localmente

  if (result.success) {
    Object.assign(userData[message.from], result.user); // Atualiza os dados do personagem localmente

    // Mensagem de introdução ao menu de missões
    await client.sendMessage(
      message.from,
      `🔹 Onde deseja recuperar suas energias?
1️⃣ ⛪*Santuário da Luz Eterna* (+1 HP e +1 Mana por minuto – Gratuito)
2️⃣ 🍻*Taverna do Dragão Adormecido* (Recuperação instantânea – Pago)
3️⃣ Voltar ao Menu`
    );

    // Atualiza o estado interno para aguardar a escolha da missão
    userStates[message.from] = "recuperarVida.retorno";
  } else {
    client.sendMessage(
      message.from,
      "Houve um problema. Por favor, tente novamente mais tarde."
    );
    navigationFlow.inicio(message);
  }
},


santuario: async (message) => {
  const result = await updateState(userData[message.from], "santuario"); // Atualiza no banco e localmente

  if (result.success) {
    Object.assign(userData[message.from], result.user); // Atualiza os dados do personagem localmente

    if (userData[message.from].status.santuario == false){
      userData[message.from].status.santuario = true;
      await client.sendMessage(
        message.from,
        "Você entrou no Santuário. Seu HP e Mana serão regenerados automaticamente."
      );
    }


    //Atualizar Personagem no banco
    const updates = {
      status: userData[message.from].status,
    };

    const update = await updateCharacter(userData[message.from], updates);
    if (update.success) {

      await client.sendMessage(
        message.from, displayStatus(userData[message.from].status.hp, userData[message.from].status.maxHP, userData[message.from].status.mana, userData[message.from].status.maxMana)
      );
      // Exibe as opções do menu
      await client.sendMessage(
        message.from,
        `Escolha uma das opções:
    1️⃣. Sair do Santuário 🚪
    2️⃣. Verificar Status Atual 📜`
      );

      // Atualiza o estado interno para aguardar a escolha da missão
      userStates[message.from] = "santuario.retorno";
    } else {
      client.sendMessage(
        message.from,
        "Houve um problema ao atualizar seu personagem. Por favor, tente novamente."
      );
      navigationFlow.inicio(message);
    }
  } else {
    client.sendMessage(
      message.from,
      "Houve um problema. Por favor, tente novamente mais tarde."
    );
    navigationFlow.inicio(message);
  }
},



};
//###############################################################
// FIM Fluxo de navegação
//#endregion

//#region Variaveias Glabais
// Mapeia o estado dos usuários
let userStates = {};

// Mapeia os dados dos usuários
let userData = {};

let battleController = {};

//#region Evento para receber mensagens
// Evento para receber mensagens
client.on("message", async (message) => {
  const userState = userStates[message.from];
  const userNumber = message.from.split("@")[0];

  console.log("userData.userState = " + JSON.stringify(userData[message.from]));

  if (!userState || !userData[message.from]) {
    try {
      // Verifica se o usuário está registrado
      const response = await axios.post(
        "http://localhost:5000/api/check-number",
        {
          phoneNumber: userNumber,
        }
      );

      if (response.data.exists) {
        userData[message.from] = response.data.user;
        userStates[message.from] = response.data.user.userState;

        if (userStates[message.from] !== "") {
          await message.reply(
            `${userData[message.from].name}! Vamos retomar de onde paramos?`
          );
          console.log(userData[message.from].userState);
          navigationFlow[userData[message.from].userState](message);
        } else {
          userData[message.from].userState = "menuInicial";
          navigationFlow.menuInicial(message);
        }
      } else {
        // Verifica se userData[message.from] já existe, caso contrário, inicializa como um objeto vazio
        if (!userData[message.from]) {
          userData[message.from] = {}; // Inicializa um objeto vazio
        }
        userData[message.from].ID = userNumber;
        userData[message.from].userState = "BoasVindas";
        navigationFlow.BoasVindas(message);
      }
    } catch (error) {
      console.error("Erro ao verificar o usuário:", error.message);
      await message.reply(
        "Houve um erro ao verificar sua conta. Por favor, tente novamente mais tarde."
      );
    }
  } else {
    handleUserResponse(message, userState);
  }
});

//#region respostas do usuário
// Lida com as respostas do usuário com base no estado atual
const handleUserResponse = async (message, state) => {
  const input = message.body.trim();
  let battle;

  switch (state) {
    //#region Boas Vindas
    case "BoasVindas":
      if (isValidInput(input, ["1", "2"])) {
        if (input === "1") {
          navigationFlow.criacaoConta(message);
        } else if (input === "2") {
          navigationFlow.faq(message);
        }
      } else {
        await message.reply(
          "Opção inválida. Por favor, responda com 1, 2 ou 3."
        );
      }
      break;

    //#region Salva conta
    case "criacaoConta.Usuario":
      if (input !== "") {
        userData[message.from].name = input.trim();
      } else {
        await message.reply("Nome invalido");
        navigationFlow.criacaoConta(message);
      }
      try {
        const response = await axios.post(
          "http://localhost:5000/api/check-user",
          {
            userName: userData[message.from].name,
          }
        );

        if (response.data.exists == false) {
          let txt = "Favor digitar E-mail?";

          //solicita E-mail

          await message.reply(txt);
          userStates[message.from] = "criacaoConta.Email";
        } else {
          await message.reply("Nome já existe. Tente novamente.");
          navigationFlow.criacaoConta(message);
        }
      } catch (error) {
        console.error("Erro ao criar conta:", error.message);
        await message.reply(
          "Houve um erro ao criar sua conta. Por favor, tente novamente."
        );
        navigationFlow.criacaoConta(message);
      }
      break;

    //#region Salva E-mail
    case "criacaoConta.Email":
      if (input !== "") {
        userData[message.from].email = input.trim();
      }

      try {
        const response = await axios.post(
          "http://localhost:5000/api/check-email",
          {
            userEmail: userData[message.from].email,
          }
        );

        if (response.data.exists == false) {
          let txt = "Aguarde Estamos criando sua conta...";

          //Cria conta no banco

          await message.reply(txt);

          // Atualiza o estado do usuário
          userStates[message.from] = "criacaoConta.Conta";
          // Avança para o próximo estado diretamente
          handleUserResponse(message, "criacaoConta.Conta");
        } else {
          await message.reply("Email já existe. Tente outro e-mail.");
          navigationFlow.criacaoConta(message);
        }
      } catch (error) {
        console.error("Erro ao criar conta:", error.message);
        await message.reply(
          "Houve um erro ao criar sua conta. Por favor, tente novamente."
        );
        navigationFlow.criacaoConta(message);
      }
      break;

    //#region Criação do Conta
    case "criacaoConta.Conta":
      console.log("Dados do usuário:", JSON.stringify(userData[message.from]));
      //Cria conta no banco
      try {
        const response = await axios.post(
          "http://localhost:5000/api/create-account",
          { dataUser: userData[message.from] }
        );

        if (response.status === 201 && response.data.create) {

          await client.sendMessage(message.from, `Sua conta foi criada com sucesso!!`);

          navigationFlow.configuracaoPersonagem(message); // Próximo passo no fluxo
        } else {
          client.sendMessage(
            message.from,
            "Houve um problema ao criar sua conta. Por favor, tente novamente."
          );
          navigationFlow.criacaoConta(message);
        }
      } catch (error) {
        console.error("Erro ao criar conta:", error.message);
        client.sendMessage(
          message.from,
          "Ocorreu um erro inesperado. Por favor, tente novamente mais tarde."
        );
        navigationFlow.criacaoConta(message);
      }
      break;

    //#region Configura Personagem
    case "configuracaoPersonagem.retorno":
      if (isValidInput(input, ["1", "2", "3", "4"])) {
        const classesConfig = {
          1: {
            classe: "guerreiro",
            status: {
              lv: 1,
              xp: 0,
              maxHP: 30,
              hp: 30,
              maxMana: 5,
              mana: 5,
              str: 4,
              con: 3,
              agi: 2,
              int: 1,
              arma1: 0,
              arma2: 0,
              armadura: 0,
              item: {},
              skillPoint: 0,
              skills: [],
              santuario: false,
            },
          },
          2: {
            classe: "arqueiro",
            status: {
              lv: 1,
              xp: 0,
              maxHP: 25,
              hp: 25,
              maxMana: 10,
              mana: 10,
              str: 2,
              con: 2,
              agi: 5,
              int: 1,
              arma1: 0,
              arma2: 0,
              armadura: 0,
              item: {},
              skillPoint: 0,
              skills: [],
              santuario: false,
            },
          },
          3: {
            classe: "mago",
            status: {
              lv: 1,
              xp: 0,
              maxHP: 20,
              hp: 20,
              maxMana: 30,
              mana: 30,
              str: 1,
              con: 2,
              agi: 1,
              int: 6,
              arma1: 0,
              arma2: 0,
              armadura: 0,
              item: {},
              skillPoint: 0,
              skills: [],
              santuario: false,
            },
          },
        };

        const selectedClass = classesConfig[input];

        try {
          const updates = {
            classe: selectedClass.classe,
            userState: "inicio",
            status: selectedClass.status,
          };

          const result = await updateCharacter(userData[message.from], updates);

          if (result.success) {
            await client.sendMessage(
              message.from,
              "Personagem criado com sucesso!"
            );
            userData[message.from] = result.user; // Atualiza os dados do personagem localmente
            navigationFlow[userData[message.from].userState](message); // Próximo passo no fluxo
          } else {
            client.sendMessage(
              message.from,
              "Houve um problema ao criar seu personagem. Por favor, tente novamente."
            );
            navigationFlow.criacaoConta(message);
          }
        } catch (error) {
          client.sendMessage(
            message.from,
            "Ocorreu um erro inesperado. Por favor, tente novamente mais tarde."
          );
          console.error("Erro inesperado:", error);
        }
      } else {
        await message.reply(
          "Opção inválida. Por favor, responda com 1, 2 ou 3."
        );
        navigationFlow.configuracaoPersonagem(message);
      }
      break;

    //#region Menu Inicial
    case "menuInicial.retorno":
      if (isValidInput(input, ["1", "2", "3", "4", "5"])) {
        if (input === "1") {
          navigationFlow.quadroDeMissoes(message);
        } else if (input === "2") {
          navigationFlow.recuperarVida(message);
        } else if (input === "3") {
          navigationFlow.faq(message);
        } else if (input === "4") {
          navigationFlow.faq(message);
        } else if (input === "5") {
          navigationFlow.faq(message);
        }
      } else {
        await message.reply(
          "Opção inválida. Por favor, responda com 1, 2 ou 3."
        );
      }
      break;

    //#region QUadro de Missões
    case "quadroDeMissoes.retorna":
      // Processa o input válido
      if (
        missionsData.missoes
          .map((mission) => String(mission.id))
          .includes(input)
      ) {
        // Inicia o battleController
        battleController[message.from] = {
          missao: input - 1,
          step: 0,
        };

        const mission = structuredClone(
          missionsData.missoes[battleController[message.from].missao]
        );
        const step = mission.steps[0];
        let optionsText = "";

        step.options.forEach((option, index) => {
          optionsText += `${index + 1}. ${option.text}\n`;
        });

        client.sendMessage(message.from, step.text);
        await client.sendMessage(message.from, optionsText);

        userStates[message.from] = "missao";
      } else if (input === "0") {
        navigationFlow.menuInicial(message);
      } else {
        await message.reply("Opção inválida, vamos tentar novamente");
        navigationFlow.quadroDeMissoes(message);
      }
      break;

    //#region Missão
    case "missao":
      // Processa o input válido
      const mission = structuredClone(
        missionsData.missoes[battleController[message.from].missao]
      );
      const step = battleController[message.from].step;

      if (mission.steps[step].options.length >= input) {
        //validando se opção digitada está correta
        const option = mission.steps[step].options[input - 1]; // Pega opção

        if (typeof option.nextStep == "number") {
          let nextStep = option.nextStep - 1;
          battleController[message.from].step = nextStep;

          switch (option.event) {
            case "batalha":
              battleController[message.from].enemy = option.enemy;
              navigationFlow.batalha(message);
              break;
            case "encontraItem":
              battleController[message.from].item = option.item;
              navigationFlow.encontraItem(message);
              break;
            case "encontraFerido":
              battleController[message.from].enemy = option.enemy;
              battleController[message.from].item = option.item;
              battleController[message.from].nextText = option.nextText;
              navigationFlow.encontraFerido(message);
              break;
            default:
              let text = mission.steps[nextStep].text;
              let optionsText = "";

              mission.steps[nextStep].options.forEach((option, index) => {
                optionsText += `${index + 1}. ${option.text}\n`;
              });

              await client.sendMessage(message.from, text);
              client.sendMessage(message.from, optionsText);

              break;
          }
        } else if (option.nextStep == "end") {
          let nextStep = mission.steps.length - 1;
          battleController[message.from].step = nextStep;
          let text = mission.steps[nextStep].text;
          await client.sendMessage(message.from, text);

          battleController[message.from].recompensa = mission.steps[nextStep].recompensa;
          navigationFlow.missaoFim(message);
        } else if (option.nextStep == "return") {
          let nextStep = mission.steps.length - 2; // Pega o penultimo step
          battleController[message.from].step = nextStep; // Pega o step
          let text = mission.steps[nextStep].text; // verbaliza a frase

          await client.sendMessage(message.from, text);
          navigationFlow.menuInicial(message);
        }
      } else {
        message.reply("Opção inválida, vamos tentar novamente");
        navigationFlow.quadroDeMissoes(message);

        battleController[message.from].step.options.forEach((option, index) => {
          optionsText += `${index + 1}. ${option.text}\n`;
        });

        await client.sendMessage(message.from, optionsText);
      }
      break;

    case "batalha.retorno":
      battle = battleController[message.from]?.battle;

      if (input === "avançar" || input === "1") {
        const result = battle.movePlayer(1); // Move o jogador para frente
        const enemy = battle.enemyAction(); // Move o inimigo para frente ou ataca
        await message.reply(result);
        await client.sendMessage(message.from, enemy);
        await client.sendMessage(message.from, battle.displayHP());
      } else if (input === "atacar" || input === "2") {
        const result = battle.playerAttack(); // Realiza um ataque

        //Verificar se o inimigo foi derrotado
        if (battle.enemy.enemyHP <= 0) {
          await message.reply(result);

          const respostaLevelUp = verificarLevelUp(battle.player); // Verificar se o personagem pulou de LV
          battle.player = respostaLevelUp.personagem; // Atualiza os dados do usuário
          const XP = displayXP(battle.player.status.xp, battle.player.status.lv);
          await client.sendMessage(message.from, respostaLevelUp.mensagem + `\n${XP}`);
        } else {
          const enemy = battle.enemyAction(); // Move o inimigo para frente ou ataca
          await message.reply(result);
          await client.sendMessage(message.from, enemy);
          await client.sendMessage(message.from, battle.displayHP());
        }
      } else if (input === "recuar" || input === "3") {
        const result = battle.movePlayer(-1); // Move o jogador para trás
        const enemy = battle.enemyAction(); // Move o inimigo para frente ou ataca
        await message.reply(result);
        await client.sendMessage(message.from, enemy);
        await client.sendMessage(message.from, battle.displayHP());
      } else if ((input === "skill" || input === "4") && Object.keys(userData[message.from].status.item).length > 0) {
        navigationFlow.usarSkill(message);
        return; // 🔴 Adicione essa linha para interromper o fluxo aqui!
      } else if ((input === "skill" || input === "4") && Object.keys(userData[message.from].status.item).length == 0) {
        await client.sendMessage(message.from, "❌ Você ainda não aprendeu nenhuma habilidade.");
        return; // 🔴 Adicione essa linha para interromper o fluxo aqui!
      }  else if ((input === "item" || input === "5") && Object.keys(userData[message.from].status.item).length > 0 ) {
        navigationFlow.usarItem(message);
        return; // 🔴 Adicione essa linha para interromper o fluxo aqui!
      } else if ( (input === "item" || input === "5") && Object.keys(userData[message.from].status.item).length == 0 ) {
        await client.sendMessage(message.from, "📦 Seu inventário está vazio.");
        navigationFlow.batalha(message);
        return; // 🔴 Adicione essa linha para interromper o fluxo aqui!
      } else if (input === "escapar" || input === "0") {
        navigationFlow.escapar(message);
        return; // 🔴 Adicione essa linha para interromper o fluxo aqui!
      }
       else {
        await client.sendMessage(
          message.from,
          "Comando inválido! Use 'avançar', 'voltar' ou 'atacar'."
        );
      }

      //Atualizar Personagem no banco
      const updates = {
        status: battle.player.status,
      };

      const update = await updateCharacter(userData[message.from], updates);
      if (update.success) {
        await client.sendMessage(
          message.from,
          "Personagem atualizado com sucesso no banco"
        );
        userData[message.from] = update.user; // Atualiza os dados do personagem localmente
      } else {
        client.sendMessage(
          message.from,
          "Houve um problema ao atualizar seu personagem. Por favor, tente novamente."
        );
      }

      //Verifica fim da batalha
      if (battle.enemy.enemyHP <= 0) {
        if (battle.enemy.arma || battle.enemy.item) {

          // Garante que haverá pelo menos uma opção válida
          const possibilidades = [];
          if (battle.enemy.arma !== undefined) possibilidades.push("arma");
          if (battle.enemy.item !== undefined) possibilidades.push("item");

          // Seleciona aleatoriamente entre arma e item (ambos sempre existentes)
          const evento = possibilidades[Math.floor(Math.random() * possibilidades.length)];
          navigationFlow.recompensa(message, evento);

        } else {
          navigationFlow.batalhaFim(message);
        }
        //Verificar se o Player foi derrotado
      } else if (battle.player.status.hp <= 0) {

        delete battleController[message.from].battle;
        delete battleController[message.from].enemy;
        
        await message.reply('⚔️ Mas seu destino ainda não acabou... Você foi encontrado e levado ao Santuário. 🏰');

        navigationFlow.santuario(message);

      } else {
        await client.sendMessage(
          message.from,
          `Estado atual:\n${battle.displayGrid()}`
        );
        navigationFlow.batalha(message);
      }

      break;

    //#region Recompensa Retorno
    case "recompensa.arma": {
      battle = battleController[message.from]?.battle;

      if (!isValidInput(input, ["1", "2", "3"])) {
        await message.reply(
          "❌ Opção inválida. Por favor, responda com 1, 2 ou 3."
        );
        return;
      }

      // Função auxiliar para equipar a arma e atualizar o banco de dados
      const equiparArma = async (armaSlot) => {
        battle.player.status[armaSlot] = battle.enemy.arma;

        let updates = { status: battle.player.status };
        let update = await updateCharacter(userData[message.from], updates);

        if (update.success) {
          userData[message.from] = update.user; // Atualiza os dados localmente
        } else {
          await client.sendMessage(
            message.from,
            "⚠️ Houve um problema ao atualizar seu personagem. Por favor, tente novamente."
          );
          return;
        }

        let armaNome = items[userData[message.from].status[armaSlot]].nome;
        await client.sendMessage(
          message.from,
          `🗡️ Você se equipa com *${armaNome}* e sente sua força crescer! O próximo inimigo que se cuide!`
        );
      };

      switch (input) {
        case "1":
          await equiparArma("arma1");
          break;
        case "2":
          await equiparArma("arma2");
          break;
        case "3":
          await client.sendMessage(
            message.from,
            "🔄 Você decidiu deixar a arma no local e segue seu caminho."
          );
          break;
      }

      if(userData[message.from].status.skillPoint == 1){
        navigationFlow.escolherSkill(message);
      }else{
      // Encerrar fluxo de navegação
      navigationFlow.batalhaFim(message);
      }


      break;
    }

    case "recompensa.item": {
      const battle = battleController[message.from]?.battle;
      const idItem = battle.enemy.item // ID do item
      let recompensaItem = {};

      // Criar uma cópia do status antes de modificar
      let statusCopy = structuredClone(userData[message.from].status);

      if (input === "1") {
        if (items[idItem].tipo === "hp") {
          statusCopy.hp = Math.min(
            statusCopy.maxHP,
            statusCopy.hp + items[idItem].valor
          );
          recompensaItem.txt = `💖 Você usou ${items[idItem].nome}${
            items[idItem].emoji
          } e recuperou *${items[idItem].valor}* de HP!\nAgora você tem *${statusCopy.hp}* HP!`;
        } else if (items[idItem].tipo === "mana") {
          statusCopy.mana = Math.min(
            statusCopy.maxMana,
            statusCopy.mana + items[idItem].valor
          );
          recompensaItem.txt = `🔷 Você usou ${items[idItem].nome}${
            items[idItem].emoji
          } e recuperou ${items[idItem].valor} de Mana!\nAgora você tem *${statusCopy.mana}* HP!`;
        } else if (items[idItem].tipo === "força") {
          statusCopy.str = Math.max(
            0,
            statusCopy.str + items[idItem].valor
          ); // Evita valores negativos
          recompensaItem.txt = `💪 Você usou ${items[idItem].nome}${
            items[idItem].emoji
          } e aumentou sua Força em ${
            items[idItem].valor
          } por 3 turnos!`;
        } else {
          recompensaItem.txt = `🤔 Esse item não tem efeito conhecido...`;
        }
      } else if (input === "2") {
        // Criar a propriedade 'item' se não existir
        if (!statusCopy.item) {
          statusCopy.item = {};
        }

        // Verifica se o item já existe e atualiza a quantidade
        statusCopy.item[idItem] =
          (statusCopy.item[idItem] || 0) + 1;
        recompensaItem.txt = `🗃️ Você guardou 1 do item ${
          items[idItem].nome
        }.`;
      }

      // Atualizar Personagem no banco de dados
      recompensaItem.updates = { status: statusCopy };
      recompensaItem.update = await updateCharacter(
        userData[message.from],
        recompensaItem.updates
      );

      if (recompensaItem.update.success) {

        console.log("Personagem atualizado com sucesso no banco");

        // Atualizar o userData com os novos dados
        userData[message.from].status = recompensaItem.update.user.status;
      } else {
        console.log("Houve um problema ao atualizar seu personagem. Por favor, tente novamente.");
      }

      // Enviar mensagem final ao jogador
      await client.sendMessage(message.from, recompensaItem.txt);

      if(userData[message.from].status.skillPoint == 1){
        navigationFlow.escolherSkill(message);
      }else{
      // Encerrar fluxo de navegação
      navigationFlow.batalhaFim(message);
      }


      break;
    }

    case "encontraItem.retorno": {
      let encontraItem = {};
      encontraItem.id = battleController[message.from].item; // ID do item

      // Criar uma cópia do status antes de modificar
      let statusCopy = structuredClone(userData[message.from].status);

      if (input === "1" && items[encontraItem.id].tipo != "missao") {
        if (items[encontraItem.id].tipo === "hp") {
          statusCopy.hp = Math.min(
            statusCopy.maxHP,
            statusCopy.hp + items[encontraItem.id].valor
          );
          encontraItem.txt = `💖 Você usou ${items[encontraItem.id].nome}${
            items[encontraItem.id].emoji
          } e recuperou *${items[encontraItem.id].valor}* de HP!\nAgora você tem *${statusCopy.hp}* HP!`;
        } else if (items[encontraItem.id].tipo === "mana") {
          statusCopy.mana = Math.min(
            statusCopy.maxMana,
            statusCopy.mana + items[encontraItem.id].valor
          );
          encontraItem.txt = `🔷 Você usou ${items[encontraItem.id].nome}${
            items[encontraItem.id].emoji
          } e recuperou ${items[encontraItem.id].valor} de Mana!\nAgora você tem *${statusCopy.mana}* HP!`;
        } else if (items[encontraItem.id].tipo === "força") {
          statusCopy.str = Math.max(
            0,
            statusCopy.str + items[encontraItem.id].valor
          ); // Evita valores negativos
          encontraItem.txt = `💪 Você usou ${items[encontraItem.id].nome}${
            items[encontraItem.id].emoji
          } e aumentou sua Força em ${
            items[encontraItem.id].valor
          } por 3 turnos!`;
        } else {
          encontraItem.txt = `🤔 Esse item não tem efeito conhecido...`;
        }
      } else if (input === "2" || items[encontraItem.id].tipo == "missao") {
        // Criar a propriedade 'item' se não existir
        if (!statusCopy.item) {
          statusCopy.item = {};
        }

        // Verifica se o item já existe e atualiza a quantidade
        statusCopy.item[encontraItem.id] =
          (statusCopy.item[encontraItem.id] || 0) + 1;
        encontraItem.txt = `🗃️ Você guardou 1 do item ${
          items[encontraItem.id].nome
        }.`;
      }

      // Atualizar Personagem no banco de dados
      encontraItem.updates = { status: statusCopy };
      encontraItem.update = await updateCharacter(
        userData[message.from],
        encontraItem.updates
      );

      if (encontraItem.update.success) {
        await client.sendMessage(
          message.from,
          "Personagem atualizado com sucesso no banco"
        );

        // Atualizar o userData com os novos dados
        userData[message.from].status = encontraItem.update.user.status;
      } else {
        await client.sendMessage(
          message.from,
          "Houve um problema ao atualizar seu personagem. Por favor, tente novamente."
        );
      }

      // Enviar mensagem final ao jogador
      await client.sendMessage(message.from, encontraItem.txt);

      // Encerrar fluxo de navegação
      navigationFlow.encontraItemFim(message);

      break;
    }

    case "usarItem.retorno": {
      // Criar uma cópia do status do usuário antes de modificar
      let statusCopy = structuredClone(userData[message.from].status);

      let usarItem = {};

      usarItem.userItems = statusCopy.item;
      usarItem.opcoesValidas = Object.keys(usarItem.userItems).map((_, index) =>
        (index + 1).toString()
      );

      if (usarItem.opcoesValidas.includes(input)) {
        // Validar Input
        usarItem.itemIDs = Object.keys(usarItem.userItems);
        usarItem.escolhaIndex = parseInt(input, 10) - 1;

        if (
          usarItem.escolhaIndex >= 0 &&
          usarItem.escolhaIndex < usarItem.itemIDs.length
        ) {
          usarItem.itemID = usarItem.itemIDs[usarItem.escolhaIndex];

          // Aplicar os efeitos do item no status copiado
          if (items[usarItem.itemID].tipo === "hp") {
            statusCopy.hp = Math.min(
              statusCopy.maxHP,
              statusCopy.hp + items[usarItem.itemID].valor
            );
            usarItem.txt = `💖 Você usou ${items[usarItem.itemID].nome}${
              items[usarItem.itemID].emoji
            } e recuperou *${items[usarItem.itemID].valor}* de HP!`;
          } else if (items[usarItem.itemID].tipo === "mana") {
            statusCopy.mana = Math.min(
              statusCopy.maxMana,
              statusCopy.mana + items[usarItem.itemID].valor
            );
            usarItem.txt = `🔷 Você usou ${items[usarItem.itemID].nome}${
              items[usarItem.itemID].emoji
            } e recuperou *${items[usarItem.itemID].valor}* de Mana!`;
          } else if (items[usarItem.itemID].tipo === "força") {
            statusCopy.str = Math.max(
              0,
              statusCopy.str + items[usarItem.itemID].valor
            );
            usarItem.txt = `💪 Você usou ${items[usarItem.itemID].nome}${
              items[usarItem.itemID].emoji
            } e aumentou sua Força em ${
              items[usarItem.itemID].valor
            } por 3 turnos!`;
          } else {
            usarItem.txt = `🤔 Esse item não tem efeito conhecido...`;
          }

          // Reduzir a quantidade do item
          statusCopy.item[usarItem.itemID] -= 1;

          // Se a quantidade chegar a 0, remover do inventário
          if (statusCopy.item[usarItem.itemID] <= 0) {
            delete statusCopy.item[usarItem.itemID];
          }
        }

        await client.sendMessage(message.from, usarItem.txt);

        battle = battleController[message.from]?.battle;
        battle.player.status = statusCopy;
        usarItem.enemy = battle.enemyAction(); // Move o inimigo para frente ou ataca
        await client.sendMessage(message.from, usarItem.enemy);
        await client.sendMessage(message.from, battle.displayHP());
        await client.sendMessage(
          message.from,
          `Estado atual:\n${battle.displayGrid()}`
        );

        // Atualizar Personagem no banco de dados
        usarItem.updates = { status: statusCopy };
        usarItem.update = await updateCharacter(
          userData[message.from],
          usarItem.updates
        );

        console.log("usarItem = " + JSON.stringify(usarItem));

        if (usarItem.update.success) {
          await client.sendMessage(
            message.from,
            "Personagem atualizado com sucesso no banco"
          );
          userData[message.from].status = usarItem.update.user.status; // Atualiza os dados do personagem localmente
        } else {
          await client.sendMessage(
            message.from,
            "Houve um problema ao atualizar seu personagem. Por favor, tente novamente."
          );
        }
      } else {
        await client.sendMessage(message.from, "❌ Digite um item válido");
        navigationFlow.usarItem(message);
      }
      navigationFlow.batalha(message);
      break;
    }

    case "encontraFerido.retorno": {
      if (input === "1") {
        // Escolhe aleatoriamente entre item (0) ou batalha (1)
        const evento = Math.random() < 0.5 ? "item" : "enemy";

        if (evento === "item") {
          const item = battleController[message.from].item;
          await client.sendMessage(
            message.from,
            `🎁 O viajante agradece sua ajuda e lhe entrega um presente:  
📜 *${items[item].nome}* ${items[item].emoji}! ${items[item].txt}`
          );

          await client.sendMessage(
            message.from,
            `O que deseja fazer?  
        1️⃣ Usar agora  
        2️⃣ Guardar para mais tarde`
          );

          delete battleController[message.from].enemy;

          // Atualiza estado para coletar o item
          userStates[message.from] = "encontraItem.retorno";
        } else {
          const enemy = battleController[message.from].enemy;
          await client.sendMessage(
            message.from,
            `⚔️ O ${enemy.enemyName} era uma armadilha! Você caiu em uma emboscada e precisa lutar contra *${enemy.enemyName}*!`
          );

          navigationFlow.batalha(message);
        }
      } else if (input === "2") {
        await client.sendMessage(
          message.from,
          "Você ignora o viajante e continua sua jornada sem olhar para trás."
        );

        delete battleController[message.from].battle;
        delete battleController[message.from].enemy;
        delete battleController[message.from].item;

        navigationFlow.continuarAventura(message);
      } else {
        await message.reply(
          "Opção inválida. Escolha 1️⃣ para Resgatar ou 2️⃣ para Ignorar."
        );
      }
      break;
    }

    case "escolherSkill.retorno": {

      let skillsDisponiveis = battleController[message.from].battle.skillsDisponiveis

      // Verifica se o número está dentro do intervalo de habilidades disponíveis
      if (isNaN(input) || input < 1 || input > skillsDisponiveis.length) {
        await client.sendMessage(message.from, "Escolha inválida. Por favor, digite um número válido.");
        navigationFlow.escolherSkill(message);
        return;
      }

      // Identifica a skill selecionada corretamente
      const [idSkillSelecionada, skillData] = skillsDisponiveis[input - 1]; // Obtém ID e objeto da skill


      // Atualiza o status do usuário (armazenando apenas o ID da skill)
      if (!userData[message.from].status.skills) {
        userData[message.from].status.skills = [];
      }
      userData[message.from].status.skills.push(idSkillSelecionada); // Salvando apenas o ID

      userData[message.from].status.skillPoint --; //Zera os skillPoints

        // Atualizar Personagem no banco de dados
        let updates = { status: userData[message.from].status };
        const updateResult = await updateCharacter(userData[message.from], updates);

      if (updateResult.success) {
        await client.sendMessage(
          message.from,
          "Personagem atualizado com sucesso no banco"
        );

        // Atualizar o userData com os novos dados
        userData[message.from].status = updateResult.user.status;
      } else {
        await client.sendMessage(
          message.from,
          "Houve um problema ao atualizar seu personagem. Por favor, tente novamente."
        );
      }

      // Envia a confirmação ao usuário com o nome da skill e o custo
      await client.sendMessage(message.from, `Você escolheu a habilidade *${skillData.nome}* ⚔️`);

      navigationFlow.batalhaFim(message);

      break;
    }

    case "escapar.retorno": {

      const mission = structuredClone(
        missionsData.missoes[battleController[message.from].missao]
      );

      if (input === "1") {
        let nextStep = mission.steps.length - 2; // Pega o penultimo step
        battleController[message.from].step = nextStep; // Pega o step
        let text = mission.steps[nextStep].text; // verbaliza a frase

        await client.sendMessage(message.from, text);

        delete battleController[message.from].battle;
        delete battleController[message.from].enemy;

        navigationFlow.menuInicial(message);
      } else if (input === "2") {
        message.reply("Você pensou melhor e decidiu enfrentar seus medos.");
        navigationFlow.batalha(message);
      } else {
        message.reply("Opção inválida, vamos tentar novamente");
        navigationFlow.escapar(message);
      }
      break;
    }

    case "recuperarVida.retorno": {

      if (input === "1") {
        navigationFlow.santuario(message);
      } else if (input === "2") {
        navigationFlow.taverna(message);
      } else if (input === "3") {
        navigationFlow.menuInicial(message);
      } else {
        message.reply("Opção inválida, vamos tentar novamente");
        navigationFlow.recuperarVida(message);
      }
      break;
    }

    case "santuario.retorno": {

      // Atualizar personagem Localmente.
      try {
        const response = await axios.post(
          "http://localhost:5000/api/check-user",
          {
            userName: userData[message.from].name,
          }
        );

        if (response.data.exists) {
          Object.assign(userData[message.from], response.data.user);

        } else {
          await message.reply("Usuario não encontrado");
          navigationFlow.criacaoConta(message);
        }
      } catch (error) {
        console.error("Erro ao atualizar conta:", error.message);
        await message.reply(
          "Erro ao atualizar conta."
        );
        navigationFlow.menuInicial(message);
      }

      if (input === "1") {

        if (userData[message.from].status.hp <= 0){
          await message.reply(
            "🩸 Você ainda está muito fraco para partir... Recupere suas forças antes de deixar o Santuário! ⚔️"
          );
          navigationFlow.santuario(message);
        } else {
          userData[message.from].status.santuario = false;

          //Atualizar Personagem no banco
          const updates = {
            status: userData[message.from].status,
          };
  
          const update = await updateCharacter(userData[message.from], updates);
          if (update.success) {
  
            await client.sendMessage(
              message.from, "👋 Você saiu do Santuário. Volte sempre!"
            );
  
            userData[message.from].userState = "menuInicial";
            navigationFlow.menuInicial(message);
          } else {
            client.sendMessage(
              message.from,
              "Houve um problema ao atualizar seu personagem. Por favor, tente novamente."
            );
            navigationFlow.santuario(message);
          }
        }

      } else if (input === "2") {
        navigationFlow.santuario(message);
      } else {
        await message.reply("⚠ Opção inválida, tente novamente.");
        navigationFlow.recuperarVida(message);
      }
      break;
    }


    default:
      await message.reply("Não entendi sua mensagem. Por favor, siga o fluxo.");
  }
};

// Inicializa o cliente
client.initialize();
