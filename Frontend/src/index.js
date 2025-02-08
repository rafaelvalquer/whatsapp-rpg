const { Client, LocalAuth, Buttons } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const axios = require("axios");
const BattleSystem = require("./battleSystem");
const missionsData = require("./missions"); // Importa o JSON
const items = require("./armas.json"); // Importa o JSON

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
    Seus status aumentaram::
    `;

    if (personagem.classe == "guerreiro") {
      mensagem += `🔹 Vida (HP): ${personagem.status.maxHP} ➡️ ${personagem.status.maxHP + 10}
🔹 Força (STR): ${personagem.status.str} ➡️ ${personagem.status.str + 3}
🔹 Resistência (CON): ${personagem.status.con} ➡️ ${personagem.status.con + 2}
🔹 Agilidade (AGI): ${personagem.status.agi} ➡️ ${personagem.status.agi +1}
🔹 Inteligência (INT): ${personagem.status.int} ➡️ ${personagem.status.int + 1}
`
      personagem.status.maxHP += 10; // Aumenta HP ao subir de nível
      personagem.status.hp = personagem.status.maxHP; // Recupera todo HP
      personagem.status.str += 3; // Aumenta força
      personagem.status.con += 2; // Aumenta defesa
      personagem.status.agi += 1; // Aumenta agilidade
      personagem.status.int += 1; // Aumenta inteligência (leve crescimento)

    } else if (personagem.classe == "arqueiro") {
      mensagem += `🔹 Vida (HP): ${personagem.status.maxHP} ➡️ ${personagem.status.maxHP + 6}
🔹 Força (STR): ${personagem.status.str} ➡️ ${personagem.status.str + 2}
🔹 Resistência (CON): ${personagem.status.con} ➡️ ${personagem.status.con + 1}
🔹 Agilidade (AGI): ${personagem.status.agi} ➡️ ${personagem.status.agi + 3}
🔹 Inteligência (INT): ${personagem.status.int} ➡️ ${personagem.status.int + 2}
`;

      personagem.status.maxHP += 6; // Aumenta HP, mas menos que o guerreiro
      personagem.status.hp = personagem.status.maxHP;
      personagem.status.str += 2; // Aumenta força moderadamente
      personagem.status.con += 1; // Pouco aumento na defesa
      personagem.status.agi += 3; // Agilidade é o foco principal
      personagem.status.int += 2; // Inteligência cresce um pouco para habilidades de mira/tática

    } else if (personagem.classe == "mago") {
      mensagem += `🔹 Vida (HP): ${personagem.status.maxHP} ➡️ ${personagem.status.maxHP + 5}
🔹 Força (STR): ${personagem.status.str} ➡️ ${personagem.status.str + 1}
🔹 Resistência (CON): ${personagem.status.con} ➡️ ${personagem.status.con + 1}
🔹 Agilidade (AGI): ${personagem.status.agi} ➡️ ${personagem.status.agi + 2}
🔹 Inteligência (INT): ${personagem.status.int} ➡️ ${personagem.status.int + 4}
      `;
      personagem.status.maxHP += 5; // HP cresce pouco, pois mago é frágil
      personagem.status.hp = personagem.status.maxHP;
      personagem.status.str += 1; // Pouca força, não é o foco
      personagem.status.con += 1; // Pouca defesa, pois mago depende de magia
      personagem.status.agi += 2; // Mais ágil que guerreiro, menos que arqueiro
      personagem.status.int += 4; // Inteligência cresce muito, pois é o atributo principal
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

// Função para dar a arma ao jogador ao vencer
function obterRecompensa(personagem, inimigo) {
  if (inimigo.arma) {
    const armaRecebida = items[inimigo.arma]; // Pega o item do inimigo
    if (armaRecebida) {
      personagem.status.arma1 = armaRecebida; // Adiciona ao personagem
      return `Você derrotou ${inimigo.enemyName} e ganhou uma ${armaRecebida.nome}!`;
    }
  }
  return `Você derrotou ${inimigo.enemyName}, mas ele não tinha itens valiosos.`;
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
Força (STR): 4  
Resistência (CON): 3  
Agilidade (AGI): 2  
Inteligência (INT): 1  

▶️ O Guerreiro é um combatente corpo a corpo, precisando estar ao lado do inimigo para atacar.  
Ele causa alto dano físico com base em sua Força (STR) e pode equipar armas pesadas para aumentar seu ataque.  

2 – Arqueiro 🏹  
Status iniciais:  
Força (STR): 2  
Resistência (CON): 2  
Agilidade (AGI): 5  
Inteligência (INT): 1  

▶️ O Arqueiro pode atacar de longe, utilizando sua Agilidade (AGI) para causar dano.  
Se o inimigo estiver muito próximo, ele usará a Força (STR) para atacar e Resistência (CON) para se defender.  

3 – Mago 🔥  
Status iniciais:  
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
        `${
          userData[message.from].name
        }, bem-vindo ao mundo! Para onde deseja ir?`
      );

      // Exibe as opções do menu
      await client.sendMessage(
        message.from,
        `Escolha uma das opções:
    1. Iniciar Missões
    2. Recuperar Vida
    3. Comprar Itens
    4. Verificar Status
    5. FAQ`
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
        `Você chega a um quadro de avisos no centro da vila, onde estão listadas missões disponíveis. 
Cada uma delas promete desafios e recompensas.
Escolha uma *missão* para iniciar a sua jornada:`
      );

      // Exibe as missões disponíveis
      let missionsMessage = "Missões disponíveis:\n";
      missionsData.missoes.forEach((mission) => {
        missionsMessage += `\n${mission.id}. ${mission.name}\n📜 ${mission.description}\n⚔️ Dificuldade: ${mission.difficulty}\n`;
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
        `Você encontrou um ${enemy.enemyName}. HP = ${enemy.enemyHP}`
      );

      await client.sendMessage(
        message.from,
        `${userData[message.from].name} hora da batalha.`
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
5.Usar item`
    } else {
      txt += `
~5.Nenhum item disponível!~`
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

  recompensa: async (message) => {
    const battle = battleController[message.from].battle;

    if (battle.enemy.arma) {
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

      await client.sendMessage(message.from, frase);
      await client.sendMessage(message.from, opcoes);
      userStates[message.from] = "recompensa.arma";
    } else {
      userStates[message.from] = "recompensa.item"; // falta fazer
    }

  },

  encontraItem: async (message) => {

      const item = battleController[message.from].item;
      await client.sendMessage(
        message.from,
        `📜 "Você encontrou uma ${items[item].nome}${items[item].emoji}! ${items[item].txt}."`
      );

      await client.sendMessage(
        message.from,
        `O que deseja fazer?  
1️⃣ Usar agora  
2️⃣ Guardar para mais tarde`);

      userStates[message.from] = "encontraItem.retorno"; // Atualize corretamente o estado
    
  },

  usarItem: async (message) => {

    let txtItem = Object.entries(userData[message.from].status.item)
    .map(([id, quantidade, index]) => `${index + 1}. ${items[id].nome} X ${quantidade}`)
    .join("\n");

    await client.sendMessage(message.from, txtItem);

    userStates[message.from] = "usarItem.retorno"; // Atualize corretamente o estado
  
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
          await message.reply("Sua conta foi criada com sucesso!");

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
              str: 4,
              con: 3,
              agi: 2,
              int: 1,
              arma1: 0,
              arma2: 0,
              armadura: 0,
              item: {},
            },
          },
          2: {
            classe: "arqueiro",
            status: {
              lv: 1,
              xp: 0,
              maxHP: 25,
              hp: 25,
              str: 2,
              con: 2,
              agi: 5,
              int: 1,
              arma1: 0,
              arma2: 0,
              armadura: 0,
              item: {},
            },
          },
          3: {
            classe: "mago",
            status: {
              lv: 1,
              xp: 0,
              maxHP: 20,
              hp: 20,
              str: 1,
              con: 2,
              agi: 1,
              int: 6,
              arma1: 0,
              arma2: 0,
              armadura: 0,
              item: {},
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
          navigationFlow.faq(message);
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

      console.log("mission = " + JSON.stringify(mission));
      console.log("step = " + JSON.stringify(step));

      if (mission.steps[step].options.length >= input) {
        //validando se opção digitada está correta
        const option = mission.steps[step].options[input - 1]; // Pega opção

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
            navigationFlow.encontraFerido(message);
            break;
          default:
            // atualiza proximo step

            //let nextStep = option.nextStep - 1;
            //battleController[message.from].step = nextStep;

            let text = mission.steps[nextStep].text;
            let optionsText = "";

            mission.steps[nextStep].options.forEach((option, index) => {
              optionsText += `${index + 1}. ${option.text}\n`;
            });

            await client.sendMessage(message.from, text);
            client.sendMessage(message.from, optionsText);

            break;
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
        await client.sendMessage(
          message.from,
          `Estado atual:\n${battle.displayGrid()}`
        );
      } else if (input === "atacar" || input === "2") {
        const result = battle.playerAttack(); // Realiza um ataque

        //Verificar se o inimigo foi derrotado
        if (battle.enemy.enemyHP <= 0) {
          await message.reply(result);

          const respostaLevelUp = verificarLevelUp(battle.player); // Verificar se o personagem pulou de LV
          battle.player = respostaLevelUp.personagem; // Atualiza os dados do usuário
          await client.sendMessage(message.from, respostaLevelUp.mensagem);
        } else {
          const enemy = battle.enemyAction(); // Move o inimigo para frente ou ataca
          await message.reply(result);
          await client.sendMessage(message.from, enemy);
          await client.sendMessage(
            message.from,
            `Estado atual:\n${battle.displayGrid()}`
          );
        }
      } else if (input === "recuar" || input === "3") {
        const result = battle.movePlayer(-1); // Move o jogador para trás
        const enemy = battle.enemyAction(); // Move o inimigo para frente ou ataca
        await message.reply(result);
        await client.sendMessage(message.from, enemy);
        await client.sendMessage(
          message.from,
          `Estado atual:\n${battle.displayGrid()}`
        );
      } else if (input === "skill" || input === "4") {
        // Falta fazer
      } else if ((input === "item" || input === "5") && Object.keys(userData[message.from].status.item).length > 0) {
        
        navigationFlow.usarItem(message);

      } else if ((input === "skill" || input === "5") && Object.keys(userData[message.from].status.item).length == 0) {
        await client.sendMessage(message.from, "📦 Seu inventário está vazio.");

      }else {
        await client.sendMessage(message.from, "Comando inválido! Use 'avançar', 'voltar' ou 'atacar'.");
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
        if (battle.enemy.arma || battle.enemy.item) { //falta fazer o item
          const frase = `Ao revirar os restos do ${
            battle.enemy.enemyName
          }, você descobre um ${items[battle.enemy.arma].nome}.`;
          await client.sendMessage(message.from, frase);

          navigationFlow.recompensa(message);
        } else {
          navigationFlow.batalhaFim(message);
        }
      } else {
        navigationFlow.batalha(message);
      }

      break;

    //#region Recompensa Retorno
    case "recompensa.arma":
      battle = battleController[message.from]?.battle;
      if (isValidInput(input, ["1", "2", "3"])) {
        if (input === "1") {
          battle.player.status.arma1 = battle.enemy.arma;
          
          //Atualizar Personagem no banco
          let  updates = {
            status: battle.player.status,
          };

          let  update = await updateCharacter(userData[message.from], updates);
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

          await client.sendMessage(message.from, `Você se equipa com ${items[userData[message.from].status.arma1].nome} e sente sua força crescer. O próximo inimigo que se cuide!`);
          navigationFlow.batalhaFim(message);

        } else if (input === "2") {
          battle.player.status.arma2 = battle.enemy.arma;

            //Atualizar Personagem no banco
            let  updates = {
              status: battle.player.status,
            };
  
            let  update = await updateCharacter(userData[message.from], updates);
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
                    
          await client.sendMessage(message.from, `Ao empunhar o ${items[userData[message.from].status.arma2].nome}, um novo poder desperta dentro de você!`);

          navigationFlow.batalhaFim(message);
        } else if (input === "3") {
          await client.sendMessage(message.from, "Você decidiu deixar a arma no local e segue seu caminho.");
          navigationFlow.batalhaFim(message);
        }
      } else {
        await message.reply(
          "Opção inválida. Por favor, responda com 1, 2 ou 3."
        );
      }
      break;

    case "encontraItem.retorno":
      let encontraItem = {};
      encontraItem.id = battleController[message.from].item //ID do item

      if (input === "1") {
        if (items[encontraItem.id].tipo === "hp") {
          userData[message.from].status.hp = Math.min(userData[message.from].status.maxHP, userData[message.from].status.hp + items[encontraItem.id].valor);
          encontraItem.txt = `💖 Você usou ${items[encontraItem.id].nome}${items[encontraItem.id].emoji} e recuperou *${items[encontraItem.id].valor}* de HP!`;
        } else if (items[encontraItem.id].tipo === "mana") {
          userData[message.from].status.mana = Math.min(userData[message.from].status.maxMana, userData[message.from].status.mana + items[encontraItem.id].valor);
          encontraItem.txt = `🔷 Você usou ${items[encontraItem.id].nome}${items[encontraItem.id].emoji} e recuperou ${items[encontraItem.id].valor} de Mana!`;
        } else if (items[encontraItem.id].tipo === "força") {
          userData[message.from].status.str = Math.max(0, userData[message.from].status.str + items[encontraItem.id].valor);  // Garantir que a força não fique negativa
          encontraItem.txt = `💪 Você usou ${items[encontraItem.id].nome}${items[encontraItem.id].emoji} e aumentou sua Força em ${items[encontraItem.id].valor} por 3 turnos!`;
        } else {
          encontraItem.txt = `🤔 Esse item não tem efeito conhecido...`;
        }

      //Atualizar Personagem no banco
      encontraItem.updates = {
        status: userData[message.from].status,
      };

      encontraItem.update = await updateCharacter(userData[message.from], encontraItem.updates);
      console.log('encontraItem = ' + JSON.stringify(encontraItem));

      if (encontraItem.update.success) {
        await client.sendMessage(
          message.from,
          "Personagem atualizado com sucesso no banco"
        );
        userData[message.from] = encontraItem.update.user; // Atualiza os dados do personagem localmente
      } else {
        client.sendMessage(
          message.from,
          "Houve um problema ao atualizar seu personagem. Por favor, tente novamente."
        );
      }

      } else if (input === "2") {

          // Verifica se o item já existe e atualiza a quantidade
          if (userData[message.from].status.item[encontraItem.id]) {
            userData[message.from].status.item[encontraItem.id] += 1;
          } else {
            userData[message.from].status.item[encontraItem.id] = 1;
          }

          encontraItem.txt = `🗃️ Você guardou 1 do item ${items[encontraItem.id].nome}.`;

      //Atualizar Personagem no banco
      encontraItem.updates = {
        status: userData[message.from].status,
      };

      encontraItem.update = await updateCharacter(userData[message.from], encontraItem.updates);
      if (encontraItem.update.success) {
        await client.sendMessage(
          message.from,
          "Personagem atualizado com sucesso no banco"
        );
        userData[message.from] = encontraItem.update.user; // Atualiza os dados do personagem localmente
      } else {
        client.sendMessage(
          message.from,
          "Houve um problema ao atualizar seu personagem. Por favor, tente novamente."
        );
      }
      }
      await client.sendMessage(message.from, encontraItem.txt);
      
      navigationFlow.encontraItemFim(message);
      
      break;

      case "usarItem.retorno":
        let usarItem = {};
        usarItem.userItems = userData[message.from].status.item
        usarItem.opcoesValidas = Object.keys(usarItem.userItems).map((_, index) => (index + 1).toString());
        

        if(usarItem.opcoesValidas.includes(input)){  //Validar Input
          usarItem.itemIDs = Object.keys(usarItem.userItems);
          usarItem.escolhaIndex = parseInt(input, 10) - 1;

          if (usarItem.escolhaIndex >= 0 && usarItem.escolhaIndex < usarItem.itemIDs.length) {
            usarItem.itemID = usarItem.itemIDs[escolhaIndex];

            if(items[usarItem.itemID].tipo == "hp"){
              userData[message.from].status.hp = Math.min(userData[message.from].status.maxHP, userData[message.from].status.hp + items[usarItem.itemID].valor);
              usarItem.txt = `💖 Você usou ${items[usarItem.itemID].nome}${items[usarItem.itemID].emoji} e recuperou *${items[usarItem.itemID].valor}* de HP!`;
            } else if (items[usarItem.itemID].tipo === "mana") {
              userData[message.from].status.mana = Math.min(userData[message.from].status.maxMana, userData[message.from].status.mana + items[usarItem.itemID].valor);
              usarItem.txt = `🔷 Você usou  ${items[usarItem.itemID].nome}${items[usarItem.itemID].emoji} e recuperou *${items[usarItem.itemID].valor}* de Mana!`;
            } else if (items[usarItem.itemID].tipo === "força") {
              userData[message.from].status.str = Math.max(0, userData[message.from].status.str + items[usarItem.itemID].valor);  // Garantir que a força não fique negativa
              encontraItem.txt = `💪 Você usou ${items[usarItem.itemID].nome}${items[usarItem.itemID].emoji} e aumentou sua Força em ${items[usarItem.itemID].valor} por 3 turnos!`;
            } else {
              encontraItem.txt = `🤔 Esse item não tem efeito conhecido...`;
            }

              // Reduz a quantidade do item
              userData[message.from].status.item[itemID] -= 1;

              // Se a quantidade chegar a 0, remove o item do inventário
              if (userData[message.from].status.item[itemID] <= 0) {
                delete userData[message.from].status.item[itemID];
              }
        }

        await client.sendMessage(message.from, usarItem.txt);
        
        const enemy = battle.enemyAction(); // Move o inimigo para frente ou ataca
        await client.sendMessage(message.from, enemy);
        await client.sendMessage(
          message.from,
          `Estado atual:\n${battle.displayGrid()}`
        );


        //Atualizar Personagem no banco
        usarItem.updates = {
          status: userData[message.from].status,
        };
  
        usarItem.update = await updateCharacter(userData[message.from], usarItem.updates);
        console.log('usarItem = ' + JSON.stringify(usarItem));
  
        if (usarItem.update.success) {
          await client.sendMessage(
            message.from,
            "Personagem atualizado com sucesso no banco"
          );
          userData[message.from] = usarItem.update.user; // Atualiza os dados do personagem localmente
        } else {
          client.sendMessage(
            message.from,
            "Houve um problema ao atualizar seu personagem. Por favor, tente novamente."
          );
        }
  
        } else {
          client.sendMessage(
            message.from,
            "Digite um item valido"
          );
          navigationFlow.usarItem(message);
        }

        navigationFlow.batalha(message);
        
        break;

    default:
      await message.reply("Não entendi sua mensagem. Por favor, siga o fluxo.");
  }
};

// Inicializa o cliente
client.initialize();
