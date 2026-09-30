function createNavigationFlow(dependencies) {
  const { client, userData, userStates, battleController, items, skills, missionsData, BattleSystem, updateCharacter, updateState, displayXP, displayStatus, displayMana, displayWeaponStrength, updateCharacterStatus, verificarLevelUp, isValidInput, MessageMedia, path } = dependencies;
  let navigationFlow;
  navigationFlow = {
  BoasVindas: async (message) => {
    const options = `Você é novo por aqui, escolha uma das opções:
1️⃣ Criar uma conta
2️⃣ Encerrar`;

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
        missionsMessage += `\n${mission.id}️⃣ *${mission.name}*\n📜 ${mission.description}\n⚔️ Dificuldade: ${mission.difficulty}\n`;
      });
      missionsMessage += `\n0️⃣ Voltar ao menu.`;

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
        `${
          userData[message.from].name
        } prepare-se para a batalha! 🔥\nDiante de você, surge um *${
          enemy.enemyName
        }*, pronto para lutar.\nHP: ❤️ *${enemy.enemyHP}*`
      );

      await client.sendMessage(
        message.from,
        MessageMedia.fromFilePath(
          path.resolve(__dirname, `./assets/${enemy.enemyName}.jpeg`)
        )
      );

      battleController[message.from].battle = new BattleSystem(
        6,
        0,
        userData[message.from],
        enemy
      ); // Inicialize o sistema de batalha com um grid de 6 posições
      const battle = battleController[message.from].battle;

      // Exibir o grid inicial
      await client.sendMessage(
        message.from,
        `Estado inicial:\n${battle.displayGrid()}`
      );
    }
    let txt = `Escolha uma das opções:
1️⃣ 🚶 Avançar
2️⃣ ⚔️ Atacar
3️⃣ 🛡️ Recuar
4️⃣ 🔥 Skill`;

    if (Object.keys(userData[message.from].status.item).length > 0) {
      txt += `
5️⃣ 🧪 Usar item`;
    } else {
      txt += `
5️⃣ 🧪 Nenhum item disponível!`;
    }

    txt += `
0️⃣ 🏃 Escapar`;

    await client.sendMessage(message.from, txt);

    userStates[message.from] = "batalha.retorno"; // Atualize corretamente o estado
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
      optionsText += `${index + 1}️⃣ ${option.text}\n`;
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
      optionsText += `${index + 1}️⃣ ${option.text}\n`;
    });

    client.sendMessage(message.from, mission.steps[step].text);
    await client.sendMessage(message.from, optionsText);

    userStates[message.from] = "missao";
  },

  recompensa: async (message, evento) => {
    const battle = battleController[message.from].battle;

    if (evento == "arma") {
  // Garantir que as armas do jogador sejam objetos válidos
  playerWeapon1 = items[userData[message.from]?.status?.arma1] || { nome: "Vazio", str: 0, con: 0, agi: 0, int: 0 };
  playerWeapon2 = items[userData[message.from]?.status?.arma2] || { nome: "Vazio", str: 0, con: 0, agi: 0, int: 0 };
  enemyWeapon = items[battle.enemy.arma] || { nome: "Desconhecido", str: 0, con: 0, agi: 0, int: 0 };

      const frase = `📜 Atributos do ${items[battle.enemy.arma].nome}:

🗡 Força: +[${enemyWeapon.str}]
🛡 Resistência: +[${enemyWeapon.con}]
🎯 Agilidade: +[${enemyWeapon.agi}]
📖 Inteligência: +[${enemyWeapon.int}]
🎒 Armas atuais:
🔹 Mão Direita: [${playerWeapon1.nome}] ${displayWeaponStrength(playerWeapon1, enemyWeapon)}
🔹 Mão Esquerda: [${playerWeapon2.nome}] ${displayWeaponStrength(playerWeapon2, enemyWeapon)}`;

      let opcoes = `⚔️ O que deseja fazer?\n`;

      const arma1Vazia = !userData[message.from]?.status?.arma1;
      const arma2Vazia = !userData[message.from]?.status?.arma2;

      if (arma1Vazia) {
        opcoes += `1️⃣ Empunhar na Mão Direita\n`;
      } else {
        opcoes += `1️⃣ Trocar a Mão Direita\n`;
      }

      if (arma2Vazia) {
        opcoes += `2️⃣ Empunhar na Mão Esquerda\n`;
      } else {
        opcoes += `2️⃣ Trocar a Mão Esquerda\n`;
      }

      opcoes += `3️⃣ Deixar a arma no local`;

      await client.sendMessage(
        message.from,
        `Ao revirar os restos do ${battle.enemy.enemyName}, você descobre um *${
          items[battle.enemy.arma].nome
        }*.`
      );
      await client.sendMessage(message.from, frase);
      await client.sendMessage(message.from, opcoes);
      userStates[message.from] = "recompensa.arma";
    } else if (evento == "item" && items[battle.enemy.item].tipo != "buff") {
      await client.sendMessage(
        message.from,
        `Ao revirar os restos do ${battle.enemy.enemyName}, você descobre um *${
          items[battle.enemy.item].nome
        }*.`
      );
      await client.sendMessage(
        message.from,
        `O que deseja fazer?  
    1️⃣ Usar agora  
    2️⃣ Guardar para mais tarde`
      );

      userStates[message.from] = "recompensa.item";
    } else if (items[battle.enemy.item].tipo == "buff") {
      await client.sendMessage(
        message.from,
        `Ao revirar os restos do ${battle.enemy.enemyName}, você descobre um *${
          items[battle.enemy.item].nome
        }*.`
      );
      await client.sendMessage(
        message.from,
        `Este item só pode ser usado durante uma batalha.
    1️⃣ Guardar para mais tarde  `
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

    if (items[item].tipo == "missao") {
      await client.sendMessage(message.from, `1️⃣ Guardar para mais tarde`);
    } else {
      await client.sendMessage(
        message.from,
        `O que deseja fazer?  
  1️⃣ Usar agora  
  2️⃣ Guardar para mais tarde`
      );
    }

    userStates[message.from] = "encontraItem.retorno"; // Atualize corretamente o estado
  },

  usarItem: async (message) => {
    let txtItem = `🎒 *Inventário de Itens*\n\n`;
    txtItem += "Qual item deseja usar? Digite o número correspondente:\n\n";
    txtItem += Object.entries(userData[message.from].status.item)
      .map(
        ([id, quantidade], index) =>
          `${index + 1}️⃣ ${items[id].nome} ${
            items[id].emoji
          }  (x${quantidade})`
      )
      .join("\n");

      txtItem += "\n0️⃣ Voltar";
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

    if (recompensa?.xp) {
      try {
        playerCopy = await api.gameAction({ ID: playerCopy.ID, action: "xp", amount: recompensa.xp });
      } catch (error) {
        await client.sendMessage(message.from, "Não foi possível salvar a experiência da missão. Tente novamente em instantes.");
        return;
      }
      const respostaLevelUp = verificarLevelUp(playerCopy); // Verificar se o personagem pulou de LV
      playerCopy = respostaLevelUp.personagem;
      const XP = displayXP(playerCopy.status.xp, playerCopy.status.lv);
      await client.sendMessage(
        message.from,
        respostaLevelUp.mensagem + `\n${XP}`
      );
    }

    if (recompensa?.ouro) {
      playerCopy.status.ouro += recompensa.ouro;
    }

      // Atualizar Personagem no banco de dados
      let updates = { status: playerCopy.status };
      const updateResult = await updateCharacter(
        userData[message.from],
        updates
      );

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
    const skillsDisponiveis = Object.entries(skills).filter(
      ([id, skill]) => id.startsWith(prefixo) && skill.lv == nivel
    );

    battleController[message.from].battle.skillsDisponiveis = skillsDisponiveis;

    if (skillsDisponiveis.length === 0) {
      await client.sendMessage(
        message.from,
        "Nenhuma habilidade disponível no momento."
      );
    }

    // Formata a mensagem de seleção de habilidades
    let txtSkill = `🛡️ *Escolha sua Nova Habilidade*\n\n`;
    txtSkill +=
      "Digite o número correspondente à skill que deseja aprender:\n\n";

    txtSkill += skillsDisponiveis
      .map(
        ([id, skill], index) =>
          `${index + 1}️⃣ ${skill.nome} ⚔️ (${skill.tipo})\n📜 ${
            skill.descricao
          }\n💠 *Custo:* ${skill.custo} Mana\n`
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

      if (userData[message.from].status.santuario == false) {
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
          message.from,
          displayStatus(
            userData[message.from].status.hp,
            userData[message.from].status.maxHP,
            userData[message.from].status.mana,
            userData[message.from].status.maxMana
          )
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

  usarSkill: async (message) => {

    const skillsPersonagem = userData[message.from].status.skills;
    const listaSkills = skillsPersonagem
      .map((id, index) => {
        const skill = skills[id];
        return `${index + 1}️⃣ *${skill.nome}* - 💠 ${skill.custo} Mana`;
      })
      .join("\n");
    
    var mensagem = `${displayMana(userData[message.from].status.mana, userData[message.from].status.maxMana)}\n🎭*Selecione sua habilidade:*\n\n${listaSkills}`;
    mensagem += "\n0️⃣ Voltar";
    await client.sendMessage(message.from, mensagem);

    userStates[message.from] = "usarSkill.retorno"; // Atualize corretamente o estado
  },

  };
  return navigationFlow;
}

module.exports = { createNavigationFlow };



