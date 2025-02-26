module.exports = {
  missoes: [
    {
      id: 1,
      name: "A Defesa do Vilarejo",
      description: "Proteja o vilarejo de uma horda de bandidos.",
      difficulty: "Fácil",
      steps: [
        {
          text: "O pequeno vilarejo de Eldoria está sob ameaça. O que você faz?",
          options: [
            {
              text: "Aceitar ajudar imediatamente.",
              nextStep: 2,
            },
            {
              text: "Recusar a ajuda e seguir seu caminho.",
              nextStep: "return",
            },
          ],
        },
        {
          text: "Os aldeões se reúnem sob sua liderança. Você percebe que eles não têm experiência em combate. O que você faz?",
          options: [
            {
              text: "Treinar os aldeões rapidamente.",
              nextStep: 3,
            },
            {
              text: "Buscar ajuda de guerreiros experientes no vilarejo próximo.",
              nextStep: 4,
            },
          ],
        },
        {
          text: "Você treinou os aldeões rapidamente. Eles estão nervosos, mas prontos para lutar. A batalha começa! O que você faz?",
          options: [
            {
              text: "Liderar o ataque frontal contra os bandidos.",
              nextStep: 8,
              event: "batalha",
              enemy: {
                enemyName: "Bandido",
                enemyHP: 10,
                enemyMaxHP: 10,
                enemyStr: 3,
                enemyCon: 2,
                position: 3,
                enemyXP: 25,
                arma: 1,
                item: 103,
              },
            },
            {
              text: "Ficar na retaguarda e coordenar as ações.",
              nextStep: 9,
              event: "batalha",
              enemy: {
                enemyName: "Bandido",
                enemyHP: 10,
                enemyMaxHP: 10,
                enemyStr: 3,
                enemyCon: 2,
                position: 5,
                enemyXP: 20,
                arma: 1,
                item: 103,
              },
            },
            {
              text: "🛡️ Formar uma linha defensiva para proteger os aldeões.",
              nextStep: 10,
              event: "batalha",
              enemy: {
                enemyName: "Bandido",
                enemyHP: 10,
                enemyMaxHP: 10,
                enemyStr: 3,
                enemyCon: 2,
                position: 2,
                enemyXP: 30,
                arma: 1,
                item: 103,
              },
            },
          ],
        },
        {
          text: "Você está em uma trilha que leva a um vilarejo próximo. Enquanto caminha, o sol começa a se pôr, e a luz dourada do entardecer ilumina o caminho à sua frente. De repente, um som fraco rompe o silêncio da floresta. Você para, atento. Um gemido, abafado pela brisa. Algo — ou alguém — está ali, oculto pela vegetação.",
          options: [
            {
              text: "Seguir o som e investigar.",
              nextStep: 5,
              event: "encontraFerido",
              nextText:
                "🩸 Diante de você, um viajante está caído, enfraquecido e visivelmente ferido. Seu rosto demonstra exaustão, e seus olhos refletem um pedido silencioso por ajuda.",
              enemy: {
                enemyName: "Guerreiro Ferido",
                enemyHP: 15,
                enemyMaxHP: 15,
                enemyStr: 5,
                enemyCon: 3,
                position: 5,
                enemyXP: 250,
                arma: 5,
              },
              item: 101,
            },
            {
              text: "Ignorar e continuar seu caminho até o vilarejo.",
              nextStep: 5,
            },
          ],
        },
        {
          text: "Antes de morrer, o guerreiro ferido aponta na direção de um caminho pouco visível entre as árvores. 'O vilarejo está por ali', ele murmura..",
          options: [
            {
              text: "Confiar no guerreiro ferido e seguir o caminho indicado.",
              nextStep: 12,
            },
            {
              text: "Ignorar a indicação do guerreiro e seguir outro caminho.",
              nextStep: 13,
            },
          ],
        },
        {
          text: "Você chegou atrasado ao vilarejo, e a batalha já está começando. O que você faz?",
          options: [
            {
              text: "Liderar o ataque frontal contra os bandidos.",
              nextStep: 7,
              event: "batalha",
              enemy: {
                enemyName: "Bandido",
                enemyHP: 10,
                enemyMaxHP: 10,
                enemyStr: 3,
                enemyCon: 2,
                position: 4,
                enemyXP: 15,
                arma: 1,
                item: 103,
              },
            },
            {
              text: "Ficar na retaguarda e coordenar as ações.",
              nextStep: 7,
              event: "batalha",
              enemy: {
                enemyName: "Bandido",
                enemyHP: 10,
                enemyMaxHP: 10,
                enemyStr: 3,
                enemyCon: 2,
                position: 5,
                enemyXP: 10,
                arma: 1,
                item: 103,
              },
            },
            {
              text: "Tentar encontrar uma posição estratégica para emboscar os bandidos.",
              nextStep: 7,
              event: "batalha",
              enemy: {
                enemyName: "Líder dos Bandidos",
                enemyHP: 15,
                enemyMaxHP: 15,
                enemyStr: 4,
                enemyCon: 3,
                position: 3,
                enemyXP: 20,
                arma: 1,
                item: 103,
              },
            },
          ],
        },

        {
          text: "⚔️ A batalha final chega ao fim com uma vitória retumbante! Os bandidos, derrotados e desmoralizados, recuam rapidamente para a floresta. Os aldeões, exaustos, mas triunfantes, comemoram sua bravura e determinação. 🏡✨",
          options: [
            {
              text: "💰 Pegar sua recompensa",
              nextStep: "end",
            },
          ],
        },

        //8
        {
          text: "Você lidera o ataque frontal contra os bandidos com sucesso! Os aldeões, inspirados pela sua bravura, lutam com determinação e derrotam a primeira onda de inimigos. No entanto, uma nova horda mais forte está se aproximando. O que você faz?",
          options: [
            {
              text: "⚔️ Continuar o ataque frontal e manter a pressão.",
              nextStep: 11,
              event: "batalha",
              enemy: {
                enemyName: "Líder dos Bandidos",
                enemyHP: 20,
                enemyMaxHP: 20,
                enemyStr: 6,
                enemyCon: 4,
                position: 2,
                enemyXP: 60,
                arma: 2,
                item: 101,
              },
            },
            {
              text: "🛡️ Recuar e reorganizar a defesa.",
              nextStep: 11,
              event: "batalha",
              enemy: {
                enemyName: "Líder dos Bandidos",
                enemyHP: 20,
                enemyMaxHP: 20,
                enemyStr: 6,
                enemyCon: 4,
                position: 4,
                enemyXP: 50,
                arma: 2,
                item: 101,
              },
            },
            {
              text: "📢 Usar a estratégia para flanquear os inimigos.",
              nextStep: 11,
              event: "batalha",
              enemy: {
                enemyName: "Líder dos Bandidos",
                enemyHP: 20,
                enemyMaxHP: 20,
                enemyStr: 6,
                enemyCon: 4,
                position: 5,
                enemyXP: 40,
                arma: 2,
                item: 101,
              },
            },
          ],
        },

        //9
        {
          text: "Ficar na retaguarda e coordenar as ações foi uma decisão sábia. Os aldeões conseguiram repelir a primeira onda de bandidos com sucesso. No entanto, uma nova horda mais forte está se aproximando. O que você faz?",
          options: [
            {
              text: "⚔️ Liderar um contra-ataque surpresa.",
              nextStep: 11,
              event: "batalha",
              enemy: {
                enemyName: "Líder dos Bandidos",
                enemyHP: 20,
                enemyMaxHP: 20,
                enemyStr: 6,
                enemyCon: 4,
                position: 2,
                enemyXP: 60,
                arma: 2,
                item: 101,
              },
            },
            {
              text: "🛡️ Fortificar as defesas e se preparar para a nova horda.",
              nextStep: 11,
              event: "batalha",
              enemy: {
                enemyName: "Líder dos Bandidos",
                enemyHP: 20,
                enemyMaxHP: 20,
                enemyStr: 6,
                enemyCon: 4,
                position: 4,
                enemyXP: 50,
                arma: 2,
                item: 101,
              },
            },
            {
              text: "📢 Enviar um grupo para flanquear os inimigos.",
              nextStep: 11,
              event: "batalha",
              enemy: {
                enemyName: "Líder dos Bandidos",
                enemyHP: 20,
                enemyMaxHP: 20,
                enemyStr: 6,
                enemyCon: 4,
                position: 5,
                enemyXP: 40,
                arma: 2,
                item: 101,
              },
            },
          ],
        },

        //10
        {
          text: "Formar uma linha defensiva provou ser eficaz. A primeira onda de bandidos foi derrotada com sucesso. No entanto, uma nova horda mais forte está se aproximando. O que você faz?",
          options: [
            {
              text: "⚔️ Liderar um ataque decisivo contra os inimigos.",
              nextStep: 11,
              event: "batalha",
              enemy: {
                enemyName: "Líder dos Bandidos",
                enemyHP: 20,
                enemyMaxHP: 20,
                enemyStr: 6,
                enemyCon: 4,
                position: 2,
                enemyXP: 60,
                arma: 2,
                item: 101,
              },
            },
            {
              text: "🛡️ Reforçar a linha defensiva e se preparar para a nova horda.",
              nextStep: 11,
              event: "batalha",
              enemy: {
                enemyName: "Líder dos Bandidos",
                enemyHP: 20,
                enemyMaxHP: 20,
                enemyStr: 6,
                enemyCon: 4,
                position: 4,
                enemyXP: 50,
                arma: 2,
                item: 101,
              },
            },
            {
              text: "📢 Coordenar um ataque conjunto com os aldeões.",
              nextStep: 11,
              event: "batalha",
              enemy: {
                enemyName: "Líder dos Bandidos",
                enemyHP: 20,
                enemyMaxHP: 20,
                enemyStr: 6,
                enemyCon: 4,
                position: 5,
                enemyXP: 40,
                arma: 2,
                item: 101,
              },
            },
          ],
        },

        //11
        {
          text: "Após várias batalhas intensas, você e os aldeões finalmente têm um momento de alívio. No entanto, o alívio é breve, pois uma figura imponente aparece no horizonte. É o Senhor da Guerra dos bandidos, um guerreiro cruel e estrategista experiente, acompanhado por sua guarda pessoal. Esta é a última onda, e a batalha final está prestes a começar.",
          options: [
            {
              text: "⚔️ Liderar o ataque final contra o Senhor da Guerra.",
              nextStep: 7,
              event: "batalha",
              enemy: {
                enemyName: "Senhor da Guerra",
                enemyHP: 70,
                enemyMaxHP: 70,
                enemyStr: 8,
                enemyCon: 6,
                position: 2,
                enemyXP: 150,
                arma: 4,
                item: 101
              },
            },
            {
              text: "🛡️ Reforçar a linha defensiva e se preparar para a nova horda.",
              nextStep: 7,
              event: "batalha",
              enemy: {
                enemyName: "Senhor da Guerra",
                enemyHP: 70,
                enemyMaxHP: 70,
                enemyStr: 8,
                enemyCon: 6,
                position: 4,
                enemyXP: 125,
                arma: 4,
                item: 101
              },
            },
            {
              text: "📢 Coordenar um ataque estratégico com os aldeões.",
              nextStep: 7,
              event: "batalha",
              enemy: {
                enemyName: "Senhor da Guerra",
                enemyHP: 70,
                enemyMaxHP: 70,
                enemyStr: 8,
                enemyCon: 6,
                position: 5,
                enemyXP: 110,
                arma: 4,
                item: 101
              },
            },
          ],
        },

        //12
        {
          text: "Você segue o caminho indicado pelo guerreiro ferido e, após uma curta caminhada, as luzes do vilarejo começam a brilhar à distância. Ao se aproximar, você percebe uma atmosfera tranquila, mas algo parece fora do comum. Você percebe uma tensão crescente entre os aldeões, que parecem desconfiados de sua presença. Alguns deles começam a murmurar entre si, e a situação parece prestes a se transformar em um confronto. O que você faz?",
          options: [
            {
              text: "⚔️ Enfrentar os aldeões e exigir respostas.",
              nextStep: 14,
              event: "batalha",
              enemy: {
                enemyName: "Aldeões",
                enemyHP: 8,
                enemyMaxHP: 8,
                enemyStr: 3,
                enemyCon: 2,
                position: 5,
                enemyXP: 20,
                arma: 4,
                item: 102
              },
            },
            {
              text: "Pedir ajuda e tentar acalmar os aldeões.",
              nextStep: 14,
            },
          ],
        },

        //13
        {
          text: "Você decide não seguir a indicação do guerreiro e opta por seguir outro caminho. À medida que se afasta, a escuridão da floresta se torna mais densa, e os sons da noite se intensificam. Você sente uma presença estranha e percebe que algo ou alguém está te observando. O que você faz?",
          options: [
            {
              text: "⚔️ Investigar a presença estranha na floresta.",
              nextStep: 15,
              event: "batalha",
              enemy: {
                enemyName: "Troll da Floresta",
                enemyHP: 12,
                enemyMaxHP: 12,
                enemyStr: 5,
                enemyCon: 1,
                position: 5,
                enemyXP: 25,
                arma: 4,
                item: 101
              },
            },
            {
              text: "Ignorar a presença e continuar caminhando rapidamente.",
              nextStep: 15,
            },
          ],
        },

        //14
        {
          text: "Os aldeões, com olhares preocupados e exaustos, explicam que não podem oferecer ajuda. 'Temos nossos próprios problemas para resolver', diz um deles. Sem outra opção, você decide voltar para o vilarejo. Porém, ao chegar, você encontra o vilarejo em caos. A batalha já começou, e os gritos de combate ecoam pela noite. O que você faz?",
          options: [
            {
              text: "Liderar o ataque frontal contra os bandidos.",
              nextStep: 8,
              event: "batalha",
              enemy: {
                enemyName: "Bandido",
                enemyHP: 10,
                enemyMaxHP: 10,
                enemyStr: 3,
                enemyCon: 2,
                position: 3,
                enemyXP: 25,
                arma: 1,
                item: 101,
              },
            },
            {
              text: "Ficar na retaguarda e coordenar as ações.",
              nextStep: 9,
              event: "batalha",
              enemy: {
                enemyName: "Bandido",
                enemyHP: 10,
                enemyMaxHP: 10,
                enemyStr: 3,
                enemyCon: 2,
                position: 5,
                enemyXP: 20,
                arma: 1,
                item: 101,
              },
            },
            {
              text: "🛡️ Formar uma linha defensiva para proteger os aldeões.",
              nextStep: 10,
              event: "batalha",
              enemy: {
                enemyName: "Bandido",
                enemyHP: 10,
                enemyMaxHP: 10,
                enemyStr: 3,
                enemyCon: 2,
                position: 2,
                enemyXP: 30,
                arma: 1,
                item: 101,
              },
            },
          ],
        },

        //15
        {
          text: "Sentindo o cansaço e a tensão acumulada, você decide voltar para o vilarejo. Ao chegar, percebe que a batalha já começou. Os gritos e sons de combate ecoam pelo vilarejo. O que você faz?",
          options: [
            {
              text: "Liderar o ataque frontal contra os bandidos.",
              nextStep: 8,
              event: "batalha",
              enemy: {
                enemyName: "Bandido",
                enemyHP: 10,
                enemyMaxHP: 10,
                enemyStr: 3,
                enemyCon: 2,
                position: 3,
                enemyXP: 25,
                arma: 1,
                item: 101,
              },
            },
            {
              text: "Ficar na retaguarda e coordenar as ações.",
              nextStep: 9,
              event: "batalha",
              enemy: {
                enemyName: "Bandido",
                enemyHP: 10,
                enemyMaxHP: 10,
                enemyStr: 3,
                enemyCon: 2,
                position: 5,
                enemyXP: 20,
                arma: 1,
                item: 101,
              },
            },
            {
              text: "🛡️ Formar uma linha defensiva para proteger os aldeões.",
              nextStep: 10,
              event: "batalha",
              enemy: {
                enemyName: "Bandido",
                enemyHP: 10,
                enemyMaxHP: 10,
                enemyStr: 3,
                enemyCon: 2,
                position: 2,
                enemyXP: 30,
                arma: 1,
                item: 101,
              },
            },
          ],
        },

        //16
        {
          text: "Enquanto você avança pela floresta, de repente você se depara com um troll da floresta. Ele é enorme e tem uma aparência ameaçadora. O troll está virado de costas para você, aparentemente sem perceber sua presença. O que você faz?",
          options: [
            {
              text: "Enfrentar o Troll da floresta de frente.",
              nextStep: 15,
              event: "batalha",
              enemy: {
                enemyName: "Troll da Floresta",
                enemyHP: 12,
                enemyMaxHP: 12,
                enemyStr: 5,
                enemyCon: 1,
                position: 3,
                enemyXP: 25,
                arma: 4,
                item: 102
              },
            },
            {
              text: "Tentar pegar o Troll de surpresa",
              nextStep: 15,
              event: "batalha",
              enemy: {
                enemyName: "Troll da Floresta",
                enemyHP: 12,
                enemyMaxHP: 12,
                enemyStr: 5,
                enemyCon: 1,
                position: 5,
                enemyXP: 20,
                arma: 4,
                item: 102
              },
            },
            {
              text: "Abandonar a missão e voltar para a sua vila.",
              nextStep: "return",
            },
          ],
        },


        {
          text: "🚶‍♂️ Você decide seguir seu caminho e deixar o vilarejo de Eldoria à sua própria sorte. Com um último olhar, você se afasta, determinado a encontrar seu próprio destino.🌟",
        },
        {
          text: "🎉 Parabéns! Você foi recompensado com 150 de XP e 100 de ouro! 🌟",
          recompensa: {
            xp: 150,
            ouro: 100
          },

          // Adicione mais etapas conforme necessário.
        },
      ],
    },

    //region Fase 2
    {
      id: 2,
      name: "A Busca pelo Artefato Perdido",
      description:
        "Recupere um antigo artefato perdido em uma caverna misteriosa.",
      difficulty: "Média",
      steps: [
        {
          text: "Você chega à entrada de uma caverna envolta em névoa. Dizem que um artefato lendário está escondido lá dentro. O que você faz?",
          options: [
            {
              text: "🏃‍♂️ Entrar na caverna sem hesitação.",
              nextStep: 2,
            },
            {
              text: "🔍 Procurar pistas ao redor antes de entrar.",
              nextStep: 3,
            },
            {
              text: "🚶‍♂️ Você decide não entrar e retorna para a cidade em busca de novos desafios. 🌆✨",
              nextStep: "return",
            },
          ],
        },
        {
          text: "Você entra na caverna e se depara com uma bifurcação. À esquerda, você ouve o som de água corrente. À direita, o som de pedras caindo. Qual caminho você escolhe?",
          options: [
            {
              text: "Ir para a esquerda, em direção ao som de água.",
              nextStep: 4,
            },
            {
              text: "Ir para a direita, onde o som de pedras ressoa.",
              nextStep: 5,
            },
          ],
        },
        {
          text: "Você encontra símbolos estranhos gravados nas pedras ao redor da caverna. Eles parecem conter uma pista sobre o artefato. O que você faz?",
          options: [
            {
              text: "🔍 Tentar decifrar os símbolos misteriosos.",
              nextStep: 6,
            },
            {
              text: "🚶‍♂️ Ignorar os símbolos e continuar explorando o local.",
              nextStep: 7,
            },
          ],
        },
        {
          text: "Seguindo o som da água, você encontra um pequeno riacho subterrâneo. Perto dele, algo está encostado em uma pedra, ofegante.",
          options: [
            {
              text: "Investigar a origem do som e verificar a situação.",
              nextStep: 8,
              event: "encontraFerido",
              nextText:
                "No riacho subterrâneo há um guardião cansado, ofegante, encostado em uma pedra. 🛡️🌊😓",
              enemy: {
                enemyName: "Guardião Cansado",
                enemyHP: 12,
                enemyMaxHP: 12,
                enemyStr: 4,
                enemyCon: 6,
                position: 4,
                enemyXP: 8,
                arma: 3,
              },
              item: 102,
            },
            {
              text: "Ignorá-lo e seguir em frente.",
              nextStep: 8,
            },
          ],
        },

        //5
        {
          text: "Você segue pelo caminho das pedras caindo e de repente é atacado por um Goblin das Sombras!",
          options: [
            {
              text: "Enfrentar de frente.",
              nextStep: 8,
              event: "batalha",
              enemy: {
                enemyName: "Goblin das Sombras",
                enemyHP: 20,
                enemyMaxHP: 20,
                enemyStr: 6,
                enemyCon: 4,
                position: 3,
                enemyXP: 25,
                arma: 7,
              },
            },
            {
              text: "Tentar surprender o Goblin das Sombras.",
              nextStep: 8,
              event: "batalha",
              enemy: {
                enemyName: "Goblin das Sombras",
                enemyHP: 20,
                enemyMaxHP: 20,
                enemyStr: 6,
                enemyCon: 4,
                position: 5,
                enemyXP: 20,
                arma: 8,
              },
            },
            {
              text: "Tentar correr",
              nextStep: 9,
            },
          ],
        },
        //6
        {
          text: "Decifrando os símbolos, você descobre um padrão que parece revelar a senha para abrir a porta. Com uma pitada de mistério, você se pergunta o que está além daquela barreira.",
          options: [
            {
              text: "Tentar abrir a porta com a senha.",
              nextStep: 8,
              event: "encontraItem",
              item: 101,
            },
            {
              text: "Seguir o seu caminho",
              nextStep: 7,
            },
          ],
        },
        //7
        {
          text: "Enquanto você segue seu caminho pela caverna escura, um barulho de passos ecoa pelas paredes. De repente, um Goblin hostil emerge das sombras, pronto para o combate. 🗡️",
          options: [
            {
              text: "Enfrentar de frente.",
              nextStep: 8,
              event: "batalha",
              enemy: {
                enemyName: "Goblin",
                enemyHP: 20,
                enemyMaxHP: 20,
                enemyStr: 6,
                enemyCon: 2,
                position: 3,
                enemyXP: 20,
                arma: 7,
              },
            },
            {
              text: "Tentar surprender o Goblin",
              nextStep: 8,
              event: "batalha",
              enemy: {
                enemyName: "Goblin",
                enemyHP: 20,
                enemyMaxHP: 20,
                enemyStr: 6,
                enemyCon: 2,
                position: 5,
                enemyXP: 20,
                arma: 7,
              },
            },
            {
              text: "Tentar correr",
              nextStep: 9,
            },
          ],
        },

        //8
        {
          text: "Após uma longa jornada, você chega a uma grande câmara iluminada por cristais brilhantes. O ar é pesado, e um pedestal se destaca no centro da sala, sugerindo que algo importante pode estar próximo.",
          options: [
            {
              text: "Examinar o pedestal em busca do artefato.",
              nextStep: 10,
            },
            {
              text: "Explorar os arredores antes de se aproximar.",
              nextStep: 24,
              event: "encontraItem",
              item: 101,
            },
          ],
        },

        //9
        {
          text: "Enquanto você tenta correr, um brilho ameaçador aparece à sua frente. De repente, o Rei dos Goblins surge das sombras, bloqueando seu caminho.",
          options: [
            {
              text: "Enfrentar o Rei dos Goblins",
              nextStep: 8,
              event: "batalha",
              enemy: {
                enemyName: "Rei dos Goblin",
                enemyHP: 30,
                enemyMaxHP: 30,
                enemyStr: 8,
                enemyCon: 3,
                position: 5,
                enemyXP: 30,
                arma: 9,
              },
            },
          ],
        },

        //10
        {
          text: "Ao se aproximar do pedestal, uma sombra se move rapidamente. Antes que você possa reagir, um guardião esquelético se ergue, protegendo o artefato.",
          options: [
            {
              text: "⚔️ Enfrentar o guardião.",
              nextStep: 11,
              event: "batalha",
              enemy: {
                enemyName: "Guardião Esquelético",
                enemyHP: 40,
                enemyMaxHP: 40,
                enemyStr: 8,
                enemyCon: 8,
                position: 5,
                enemyXP: 30,
                arma: 3,
              },
            },
            {
              text: "👀 Tentar se esconder e observar os movimentos do guardião.",
              nextStep: 17,
            },
          ],
        },

        //11
        {
          text: "Após derrotar o guardião, você avança para o pedestal. Ao tocar nele, o chão treme e uma parede se move, revelando um corredor escuro. Um rugido ecoa à sua frente.",
          options: [
            {
              text: "Seguir pelo corredor e enfrentar a criatura que o espera.",
              nextStep: 12,
              event: "batalha",
              enemy: {
                enemyName: "Serpente das Sombras",
                enemyHP: 14,
                enemyMaxHP: 14,
                enemyStr: 4,
                enemyCon: 3,
                position: 5,
                enemyXP: 20,
                arma: 4,
              },
            },
            {
              text: "Pegar o artefato rapidamente.",
              nextStep: 14,
            },
          ],
        },

        //12
        {
          text: "Com a Serpente derrotada, você atravessa o corredor e chega a uma câmara secreta. No centro, repousa um baú.",
          options: [
            {
              text: "Abrir o baú.",
              nextStep: 13,
              event: "encontraItem",
              item: 101,
            },
            {
              text: "Voltar e pegar o artefato.",
              nextStep: 13,
            },
          ],
        },

        //13
        {
          text: "Você retorna à sala principal, onde o artefato repousa sobre o pedestal. O ar parece mais pesado, como se algo estivesse observando você das sombras.",
          options: [
            {
              text: "Pegar o artefato rapidamente.",
              nextStep: 14,
            },
            {
              text: "Observar melhor os arredores antes de agir.",
              nextStep: 21,
            },
          ],
        },

        //14
        {
          text: "Você segura o artefato em mãos, sentindo uma energia pulsante emanando dele. A caverna parece estremecer levemente, como se tivesse perdido algo valioso. Agora, resta decidir o que fazer com o objeto.",
          options: [
            {
              text: "Entregar o artefato ao seu verdadeiro dono.",
              nextStep: 15,
            },
            {
              text: "Ficar com o artefato para si.",
              nextStep: 16,
              event: "encontraItem",
              item: 201,
            },
          ],
        },

        //15
        {
          text: "O artefato agora está em boas mãos, e sua bravura foi reconhecida por todos. 🌟",
          options: [
            {
              text: "💰 Pegar sua recompensa",
              nextStep: "end",
            },
          ],
        },

        //16
        {
          text: "🔮 Com o artefato escondido, você retorna ao contratante e diz que não conseguiu encontrá-lo. Ele suspira, desapontado, mas reconhece seus esforços e ainda assim lhe concede uma recompensa por sua coragem. Enquanto isso, o poder do artefato permanece em suas mãos, seu segredo bem guardado. 🌟",
          options: [
            {
              text: "💰 Pegar sua recompensa",
              nextStep: "end",
            },
          ],
        },

        //17
        {
          text: "Você decide se esconder nas sombras e observar os movimentos do guardião esquelético. O guardião parece estar em uma patrulha constante, seus passos ecoando na câmara.",
          options: [
            {
              text: "Aproveitar um momento de distração e tentar pegar o artefato.",
              nextStep: 18,
            },
            {
              text: "Esperar mais tempo para ver se o guardião baixa a guarda.",
              nextStep: 23,
            },
          ],
        },

        //18
        {
          text: "⚡ Você aproveita um instante em que o guardião esquelético se vira para o lado oposto e avança silenciosamente até o pedestal. Suas mãos tocam o artefato... Mas antes que possa recuá-las, um brilho fantasmagórico preenche a sala. O guardião percebe sua ação e ruge com fúria, erguendo sua lâmina enferrujada!",
          options: [
            {
              text: "⚔️ Lutar contra o guardião esquelético e defender sua vida.",
              nextStep: 20,
              event: "batalha",
              enemy: {
                enemyName: "Guardião Esquelético",
                enemyHP: 40,
                enemyStr: 8,
                enemyCon: 8,
                position: 4,
                enemyXP: 30,
                arma: 3,
                item: 101,
              },
            },
            {
              text: "📜 Recitar um antigo verso de um pergaminho que você encontrou.",
              nextStep: 19,
            },
            {
              text: "🚶‍♂️ Correr imediatamente para a saída e escapar com vida.",
              nextStep: "return",
            },
          ],
        },

        //19
        {
          text: "Ao recitá-lo em voz alta, o guardião fica imóvel, como se estivesse enfeitiçado, e se afasta.",
          options: [
            {
              text: "Pegar o artefato rapidamente.",
              nextStep: 14,
            },
            {
              text: "Observar melhor os arredores antes de agir.",
              nextStep: 24,
            },
          ],
        },

        //20
        {
          text: "🔥 Após enfrentar desafios, tomar decisões difíceis e se esquivar de perigos, você finalmente chega ao centro da câmara. O artefato brilha intensamente em suas mãos, enquanto ecos sobrenaturais percorrem o ambiente. Você sente que este é o momento de decidir seu destino.",
          options: [
            {
              text: "Pegar o artefato rapidamente.",
              nextStep: 14,
            },
            {
              text: "Observar melhor os arredores antes de agir.",
              nextStep: 24,
            },
          ],
        },

        //21
        {
          text: "🔎 Você se mantém oculto nas sombras, estudando cada detalhe do ambiente. Percebe inscrições antigas nas paredes, possivelmente pistas sobre a história do local. Além disso, nota um pequeno mecanismo próximo ao pedestal, que pode ser um gatilho para uma armadilha.",
          options: [
            {
              text: "Examinar as inscrições para tentar compreender seu significado.",
              nextStep: 22,
            },
            {
              text: "Ignorar os detalhes e pegar o artefato rapidamente.",
              nextStep: 14,
            },
          ],
        },

        //22
        {
          text: "📖 As inscrições falam da 'Relíquia dos Antigos', um artefato selado há séculos. Ao decifrá-las, um painel secreto se move, revelando um baú oculto.",
          options: [
            {
              text: "Abrir o baú.",
              nextStep: 20,
              event: "encontraItem",
              item: 101,
            },
            {
              text: "Ignorar o baú e focar no artefato.",
              nextStep: 20,
            },
          ],
        },

        //23
        {
          text: "Guardião baixa a guarda e some sobre seus olhos.",
          options: [
            {
              text: "Pegar o artefato rapidamente.",
              nextStep: 14,
            },
            {
              text: "Observar melhor os arredores antes de agir.",
              nextStep: 21,
            },
          ],
        },

        //24
        {
          text: "Você decide observar melhor os arredores antes de agir. O silêncio é interrompido por um gemido fraco. Em meio às sombras, algo está encostado em uma coluna, ofegante e murmurando palavras desconexas.",
          options: [
            {
              text: "Investigar a origem do som e verificar a situação.",
              nextStep: 20,
              event: "encontraFerido",
              nextText:
                "Nas sombras, há um viajante desesperado. Seus olhos estão cheios de medo e ele parece perdido. 🧳🌑😓",
              enemy: {
                enemyName: "Viajante Desesperado",
                enemyHP: 35,
                enemyMaxHP: 35,
                enemyStr: 5,
                enemyCon: 2,
                position: 5,
                enemyXP: 25,
                arma: 1,
              },
              item: 101,
            },
            {
              text: "Pegar o artefato rapidamente.",
              nextStep: 14,
            },
          ],
        },

        //FIM
        {
          text: "🚶‍♂️ Diante dos perigos desconhecidos, você decide que essa missão não vale o risco. Com um último olhar para a caverna, vira-se e retorna ao vilarejo, deixando o artefato para quem for ousado o suficiente para buscá-lo. Talvez outro desafio o aguarde na cidade... 🌆✨",
        },
        {
          text: "🎉 Parabéns! Você foi recompensado com 200 de XP e 150 de ouro! 🌟",
          recompensa: {
            xp: 200,
            ouro: 150
          },

          // Adicione mais etapas conforme necessário.
        },
      ],
    },
  ],
};
