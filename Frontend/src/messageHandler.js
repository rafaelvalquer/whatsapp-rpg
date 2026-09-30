function createMessageHandler(dependencies) {
  const { userData, userStates, battleController, client, navigationFlow, items, skills, missionsData, BattleSystem, updateCharacter, updateCharacterStatus, updateState, verificarLevelUp, displayXP, displayMana, displayStatus, displayWeaponStrength, isValidInput, axios, API_URL, api } = dependencies;
async function handleUserResponse(message, state) {
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
          "Opção inválida. Por favor, responda com 1 ou 2."
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
          `${API_URL}/check-user`,
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
          `${API_URL}/check-email`,
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
      //Cria conta no banco
      try {
        const response = await axios.post(
          `${API_URL}/create-account`,
          { dataUser: userData[message.from] }
        );

        if (response.status === 201 && response.data.create) {
          await client.sendMessage(
            message.from,
            `Sua conta foi criada com sucesso!!`
          );

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
              ouro: 0,
              arma1: 0,
              arma2: 0,
              armadura: 0,
              item: {},
              itemMissao: {},
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
              ouro: 0,
              arma1: 0,
              arma2: 0,
              armadura: 0,
              item: {},
              itemMissao: {},
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
              ouro: 0,
              arma1: 0,
              arma2: 0,
              armadura: 0,
              item: {},
              itemMissao: {},
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
          optionsText += `${index + 1}️⃣ ${option.text}\n`;
        });

        await client.sendMessage(message.from, step.text);
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
                optionsText += `${index + 1}️⃣ ${option.text}\n`;
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
        await client.sendMessage(
          message.from,
          "Opção inválida, vamos tentar novamente"
        );

        let text = mission.steps[step].text;
        let optionsText = "";

        mission.steps[step].options.forEach((option, index) => {
          optionsText += `${index + 1}️⃣ ${option.text}\n`;
        });

        await client.sendMessage(message.from, text);
        await client.sendMessage(message.from, optionsText);
      }
      break;

    case "batalha.retorno":
      battle = battleController[message.from]?.battle;

      if (battle.buffsAtivos?.some((buff) => buff.efeito === "queimadura")) {
        for (const buff of battle.buffsAtivos.filter((entry) => entry.efeito === "queimadura")) {
          battle.applyBuffs(buff);
          await client.sendMessage(message.from, `${buff.emoji} O ${battle.enemy.enemyName} sofre ${buff.valor} de dano por queimadura.`);
        }
        if (battle.enemy.enemyHP <= 0) {
          await verificarInimigoDerrotado(message, battle);
          return;
        }
      }

        let turnTaken = false;
        if (input === "avançar" || input === "1") {
          const result = battle.movePlayer(1); // Move o jogador para frente
          await client.sendMessage(message.from, result);
          turnTaken = /movido/.test(result);
  
        } else if (input === "atacar" || input === "2") {
          const result = battle.playerAttack(); // Realiza um ataque
  
          //Verificar se o inimigo foi derrotado
          if (battle.enemy.enemyHP <= 0) {
            await client.sendMessage(message.from, result);
            await verificarInimigoDerrotado(message, battle);
            return;
          } else {
            await client.sendMessage(message.from, result);
          }
  
          turnTaken = true;
  
        } else if (input === "recuar" || input === "3") {
          const result = battle.movePlayer(-1); // Move o jogador para trás
          await client.sendMessage(message.from,result);
          turnTaken = /movido/.test(result);
  
        } else if ((input === "skill" || input === "4") && userData[message.from].status.skills.length > 0) {
          navigationFlow.usarSkill(message);
          return; // 🔴 Adicione essa linha para interromper o fluxo aqui!
        } else if ((input === "skill" || input === "4") && userData[message.from].status.skills.length === 0) {
          await client.sendMessage(
            message.from,
            "❌ Você ainda não aprendeu nenhuma habilidade."
          );
          navigationFlow.batalha(message);
          return; // 🔴 Adicione essa linha para interromper o fluxo aqui!
        } else if ((input === "item" || input === "5") && Object.keys(userData[message.from].status.item || {}).length > 0) {
          navigationFlow.usarItem(message);
          return; // 🔴 Adicione essa linha para interromper o fluxo aqui!
        } else if ((input === "item" || input === "5") && Object.keys(userData[message.from].status.item || {}).length === 0) {
          await client.sendMessage(message.from, "📦 Seu inventário está vazio.");
          navigationFlow.batalha(message);
          return; // 🔴 Adicione essa linha para interromper o fluxo aqui!
        } else if (input === "escapar" || input === "0") {
          navigationFlow.escapar(message);
          return; // 🔴 Adicione essa linha para interromper o fluxo aqui!
        } else {
          await client.sendMessage(
            message.from,
            "Comando inválido! Use 'avançar', 'voltar' ou 'atacar'."
          );
        }
        if (turnTaken && battle.enemy.enemyHP > 0 && battle.player.status.hp > 0) {
          const enemy = battle.enemyAction();
          await client.sendMessage(message.from, enemy);
          await client.sendMessage(message.from, battle.displayHP());
          const expired = battle.tickBuffs();
          for (const buff of expired) await client.sendMessage(message.from, `${buff.emoji} Seu efeito *${buff.nome}* acabou.`);
        }

      //Atualizar Personagem no banco
      const updates = {
        status: battle.player.status,
      };

      const update = await updateCharacter(userData[message.from], updates);
      if (update.success) {
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
          const evento =
            possibilidades[Math.floor(Math.random() * possibilidades.length)];
          navigationFlow.recompensa(message, evento);
        } else {
          navigationFlow.batalhaFim(message);
        }
        //Verificar se o Player foi derrotado
      } else if (battle.player.status.hp <= 0) {
        delete battleController[message.from].battle;
        delete battleController[message.from].enemy;

        await message.reply(
          "⚔️ Mas seu destino ainda não acabou... Você foi encontrado e levado ao Santuário. 🏰"
        );

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

      if (userData[message.from].status.skillPoint == 1) {
        navigationFlow.escolherSkill(message);
      } else {
        // Encerrar fluxo de navegação
        navigationFlow.batalhaFim(message);
      }

      break;
    }

    case "recompensa.item": {
      const battle = battleController[message.from]?.battle;
      const idItem = battle.enemy.item; // ID do item
      let recompensaItem = {};

      // Criar uma cópia do status antes de modificar
      let statusCopy = structuredClone(userData[message.from].status);

      if (input === "1" && items[idItem].tipo != "buff") {
        if (items[idItem].tipo === "hp") {
          statusCopy.hp = Math.min(
            statusCopy.maxHP,
            statusCopy.hp + items[idItem].valor
          );
          recompensaItem.txt = `💖 Você usou ${items[idItem].nome}${items[idItem].emoji} e recuperou *${items[idItem].valor}* de HP!\nAgora você tem *${statusCopy.hp}* HP!`;
        } else if (items[idItem].tipo === "mana") {
          statusCopy.mana = Math.min(
            statusCopy.maxMana,
            statusCopy.mana + items[idItem].valor
          );
          recompensaItem.txt = `🔷 Você usou ${items[idItem].nome}${items[idItem].emoji} e recuperou ${items[idItem].valor} de Mana!\nAgora você tem *${statusCopy.mana}* HP!`;
        } else {
          recompensaItem.txt = `🤔 Esse item não tem efeito conhecido...`;
        }
      } else if (
        input === "2" ||
        (input === "1" && items[idItem].tipo == "buff")
      ) {
        // Criar a propriedade 'item' se não existir
        if (!statusCopy.item) {
          statusCopy.item = {};
        }

        // Verifica se o item já existe e atualiza a quantidade
        statusCopy.item[idItem] = (statusCopy.item[idItem] || 0) + 1;
        recompensaItem.txt = `🗃️ Você guardou 1 do item ${items[idItem].nome}.`;
      }

      // Atualizar Personagem no banco de dados
      recompensaItem.updates = { status: statusCopy };
      recompensaItem.update = await updateCharacter(
        userData[message.from],
        recompensaItem.updates
      );

      if (recompensaItem.update.success) {

        // Atualizar o userData com os novos dados
        userData[message.from].status = recompensaItem.update.user.status;
      } else {
      }

      // Enviar mensagem final ao jogador
      await client.sendMessage(message.from, recompensaItem.txt);

      if (userData[message.from].status.skillPoint == 1) {
        navigationFlow.escolherSkill(message);
      } else {
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
          } e recuperou *${
            items[encontraItem.id].valor
          }* de HP!\nAgora você tem *${statusCopy.hp}* HP!`;
        } else if (items[encontraItem.id].tipo === "mana") {
          statusCopy.mana = Math.min(
            statusCopy.maxMana,
            statusCopy.mana + items[encontraItem.id].valor
          );
          encontraItem.txt = `🔷 Você usou ${items[encontraItem.id].nome}${
            items[encontraItem.id].emoji
          } e recuperou ${
            items[encontraItem.id].valor
          } de Mana!\nAgora você tem *${statusCopy.mana}* HP!`;
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
      } else if (input === "2" || (input === "1" && items[encontraItem.id].tipo == "missao")) {
        
        if(input === "2"){
          // Criar a propriedade 'item' se não existir
          if (!statusCopy.item) {
            statusCopy.item = {};
          }

          // Verifica se o item já existe e atualiza a quantidade
          statusCopy.item[encontraItem.id] = (statusCopy.item[encontraItem.id] || 0) + 1;
            encontraItem.txt = `🗃️ Você guardou 1 do item ${
            items[encontraItem.id].nome
          }.`;
        } else {
          // Criar a propriedade 'itemMissao' se não existir
          if (!statusCopy.itemMissao) {
            statusCopy.itemMissao = {};
          }

        // Salvar o item como true
        statusCopy.itemMissao[encontraItem.id] = true;
        encontraItem.txt = `🗃️ Você obteve o item ${items[encontraItem.id].nome}.`;
        }
      } else {
        await message.reply(
          "❌ Opção inválida."
        );
        navigationFlow.encontraItem(message);
        return; // 🔴 Adicione essa linha para interromper o fluxo aqui!
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
      
      if(input != '0'){
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
            } else if (items[usarItem.itemID].tipo === "buff") {
              usarItem.txt = `💪 Você usou ${items[usarItem.itemID].nome}${
                items[usarItem.itemID].emoji
              } e aumentou sua Força em ${items[usarItem.itemID].valor} por ${
                items[usarItem.itemID].duracao
              } turnos!`;

              // Verifica se não existe buffs ativos
              if (!battleController[message.from].battle.buffsAtivos) {
                // Cria a propriedade buffsAtivos como um array e adiciona o primeiro buff
                battleController[message.from].battle.buffsAtivos = [
                  {
                    nome: items[usarItem.itemID].nome,
                    valor: items[usarItem.itemID].valor,
                    duracao: items[usarItem.itemID].duracao,
                    efeito: items[usarItem.itemID].efeito,
                    emoji: items[usarItem.itemID].emoji
                  },
                ];
              } else {
                // Adiciona o novo buff ao array de buffs
                battleController[message.from].battle.buffsAtivos.push({
                  nome: items[usarItem.itemID].nome,
                  valor: items[usarItem.itemID].valor,
                  duracao: items[usarItem.itemID].duracao,
                  efeito: items[usarItem.itemID].efeito,
                  emoji: items[usarItem.itemID].emoji
                });
              }
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
      }
      battle = battleController[message.from]?.battle
      await client.sendMessage(
        message.from,
        `Estado atual:\n${battle.displayGrid()}`
      );
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
            `O que deseja fazer? \n1️⃣ Usar agora \n2️⃣ Guardar para mais tarde`
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

          delete battleController[message.from].item;
          navigationFlow.batalha(message);
        }
      } else if (input === "2") {
        await client.sendMessage(
          message.from,
          "Você ignora o viajante e continua sua jornada sem olhar para trás."
        );

        delete battleController[message.from].item;

        navigationFlow.batalhaFim(message);
      } else {
        await message.reply(
          "Opção inválida. Escolha 1️⃣ para Resgatar ou 2️⃣ para Ignorar."
        );
      }
      break;
    }

    case "escolherSkill.retorno": {
      let skillsDisponiveis =
        battleController[message.from].battle.skillsDisponiveis;

      // Verifica se o número está dentro do intervalo de habilidades disponíveis
      if (isNaN(input) || input < 1 || input > skillsDisponiveis.length) {
        await client.sendMessage(
          message.from,
          "Escolha inválida. Por favor, digite um número válido."
        );
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

      userData[message.from].status.skillPoint--; //Zera os skillPoints

      // Atualizar Personagem no banco de dados
      let updates = { status: userData[message.from].status };
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

      // Envia a confirmação ao usuário com o nome da skill e o custo
      await client.sendMessage(
        message.from,
        `Você escolheu a habilidade *${skillData.nome}* ⚔️`
      );

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
          `${API_URL}/check-user`,
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
        await message.reply("Erro ao atualizar conta.");
        navigationFlow.menuInicial(message);
      }

      if (input === "1") {
        if (userData[message.from].status.hp <= 0) {
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
              message.from,
              "👋 Você saiu do Santuário. Volte sempre!"
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

    case "usarSkill.retorno": {

      if(input != '0'){
        const skillSelecionadaIndex = parseInt(input) - 1;
        const skillId = userData[message.from].status.skills[skillSelecionadaIndex];
    
        if (!skillId) {
            await client.sendMessage(
                message.from,
                "❌ Escolha inválida! Selecione uma das habilidades listadas."
            );
            return navigationFlow.usarSkill(message);
        }
    
        const skill = skills[skillId];
        if (!skill || ![101, 102, 301].includes(Number(skillId))) {
          await client.sendMessage(message.from, "❌ Essa habilidade ainda não pode ser usada em combate.");
          return navigationFlow.batalha(message);
        }
    
        if (userData[message.from].status.mana < skill.custo) {
            await client.sendMessage(
                message.from,
                `💠 Mana insuficiente! Você precisa de ${skill.custo} Mana para usar *${skill.nome}*`
            );
            return navigationFlow.batalha(message);
        }
    
        const battle = battleController[message.from]?.battle;
        if (!battle) return navigationFlow.menuInicial(message);
        const distance = Math.abs(battle.playerPosition - battle.enemyPosition);
        if ((Number(skillId) === 101 && distance !== 1) || (Number(skillId) === 301 && distance > 5)) {
          await client.sendMessage(message.from, `O inimigo está fora do alcance de *${skill.nome}*; sua Mana não foi consumida.`);
          return navigationFlow.batalha(message);
        }
        let result = "";
  
        if (!battle.buffsAtivos) {
          // Cria a propriedade buffsAtivos como um array e adiciona o primeiro buff
          battle.buffsAtivos = [];
        }
    
        if (battle.buffsAtivos?.length) {
          for (const buff of battle.buffsAtivos.filter((entry) => entry.efeito === "queimadura")) {
            battle.applyBuffs(buff);
            await client.sendMessage(message.from, `${buff.emoji} O ${battle.enemy.enemyName} sofre ${buff.valor} de dano por queimadura.`);
          }
          if (battle.enemy.enemyHP <= 0) return await verificarInimigoDerrotado(message, battle);
        }

        const manaCost = skill.custo;
        const manaUpdate = await axios.post(`${API_URL}/game-action`, {
          ID: userData[message.from].ID,
          action: "mana",
          amount: manaCost,
        }).catch((error) => ({ data: { success: false, message: error.response?.data?.message || error.message } }));
        if (!manaUpdate.data.success) {
          await client.sendMessage(message.from, "💠 Não foi possível gastar Mana; confira o saldo e tente novamente.");
          return navigationFlow.batalha(message);
        }
        userData[message.from] = manaUpdate.data.user;
        battle.player = userData[message.from];
        const buffsAtTurnStart = [...battle.buffsAtivos];
  
        // Usar a skill correta
        switch (skillId) {
            case 101:
                result = battle.golpeBrutal(skill);
                break;
            case 102:
                result = `🛡️ *Defesa Implacável ativada!* Você receberá metade do dano pelos próximos 3 turnos!`;
                battle.buffsAtivos.push({
                    nome: "Defesa Implacável",
                    valor: battle.player.status.con,
                    efeito: "reduzirDano",
                    duracao: 3,
                    emoji: "🛡️",
                });
                break;
            case 301:
                result = battle.bolaDeFogo(skill);
                battle.buffsAtivos.push({
                  nome: "Bola de fogo",
                  valor: Math.floor(battle.player.status.int / 4),
                  efeito: "queimadura",
                  duracao: 3,
                  emoji: "🔥",
              });
                break;
            default:
                await client.sendMessage(message.from, "❌ Skill inválida.");
                return navigationFlow.usarSkill(message);
        }
    
        await message.reply(result);
    
        // Se o inimigo foi derrotado
        if (battle.enemy.enemyHP <= 0) {
          return await verificarInimigoDerrotado(message, battle);
      }
    
        // Se o jogador foi derrotado
        if (battle.player.status.hp <= 0) {
            delete battleController[message.from].battle;
            delete battleController[message.from].enemy;
    
            await message.reply(
                "⚔️ Mas seu destino ainda não acabou... Você foi encontrado e levado ao Santuário. 🏰"
            );
    
            // Atualiza o personagem antes de sair da função
            await updateCharacterStatus(message.from, battle.player.status);
            return navigationFlow.santuario(message);
        }
    
        // Ação do inimigo se a luta continua
        const enemyAction = battle.enemyAction();
        await client.sendMessage(message.from, enemyAction);
        await client.sendMessage(message.from, battle.displayHP());
        if (battle.player.status.hp <= 0) {
          delete battleController[message.from].battle;
          delete battleController[message.from].enemy;
          await updateCharacterStatus(message.from, battle.player.status);
          await message.reply("Você foi derrotado e levado ao Santuário. 🏰");
          return navigationFlow.santuario(message);
        }
        const expiredBuffs = battle.tickBuffs(buffsAtTurnStart);
        for (const buff of expiredBuffs) await client.sendMessage(message.from, `${buff.emoji} Seu efeito *${buff.nome}* acabou.`);
    
    
        // Atualizar personagem antes de continuar
        await updateCharacterStatus(message.from, battle.player.status);
    
        // Exibir o grid do combate e continuar a batalha
        await client.sendMessage(
            message.from,
            `Estado atual:\n${battle.displayGrid()}`
        );
    
        return navigationFlow.batalha(message);
      } else {
        //Digitou 0 para voltar para a batalha
        const battle = battleController[message.from]?.battle;
        // Exibir o grid do combate e continuar a batalha
        await client.sendMessage(
          message.from,
          `Estado atual:\n${battle.displayGrid()}`
        );
        return navigationFlow.batalha(message);
      }

  }
  

    default:
      await message.reply("Não entendi sua mensagem. Por favor, siga o fluxo.");
  }
};
  return handleUserResponse;
}

module.exports = { createMessageHandler };
