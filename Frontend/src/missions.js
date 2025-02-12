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
              nextStep: 2
            },
            {
              text: "Recusar a ajuda e seguir seu caminho.",
              nextStep: "end",
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
              text: "Buscar ajuda de guerreiros experientes na cidade próxima.",
              nextStep: 4,
            },
          ],
        },
        {
          text: "Você treinou os aldeões rapidamente. Eles estão nervosos, mas prontos para lutar. A batalha começa! O que você faz?",
          options: [
            {
              text: "Liderar o ataque frontal contra os bandidos.",
              nextStep: "end",
              event: 'batalha',
              enemy: {
                enemyName: 'Bandido',
                enemyHP: 10,
                enemyStr: 3,
                enemyCon: 2,
                position: 3,
                enemyXP: 15,
                arma: 1
              },
            },
            {
              text: "Ficar na retaguarda e coordenar as ações.",
              nextStep: "end",
              event: 'batalha',
              enemy: {
                enemyName: 'Bandido',
                enemyHP: 10,
                enemyStr: 3,
                enemyCon: 2,
                position: 5,
                enemyXP: 10,
                arma: 1
              },
            },
          ],
        },
        {
          text: "Na cidade próxima, você encontra um guerreiro ferido. Ele pode ajudá-lo se você tratá-lo. O que você faz?",
          options: [
            {
              text: "Ajudar o guerreiro ferido.",
              nextStep: 5,
              event: 'encontrarFerido',
              enemy: {
                enemyName: 'Guerreiro Ferido',
                enemyHP: 15,
                enemyStr: 5,
                enemyCon: 5,
                position: 5,
                enemyXP: 10,
                arma: 5
              },
              item: 101
            },
            {
              text: "Deixá-lo e voltar ao vilarejo sozinho.",
              nextStep: 5,
            },
          ],
        },
        {
          text: "Você não teve sucesso em encontrar ajuda. No meio do caminho, você encontra um baú abandonado. O que deseja fazer?",
          options: [
            {
              text: "Abrir o baú.",
              nextStep: 6,
              event: 'encontraItem',
              item: 101
            },
            {
              text: "Ignorar e seguir caminho.",
              nextStep: 6,
            },
          ],
        },
        {
          text: "Você chegou atrasado ao vilarejo, e a batalha já está começando. O que você faz?",
          options: [
            {
              text: "Liderar o ataque frontal contra os bandidos.",
              nextStep: "end",
              event: 'batalha',
              enemy: {
                enemyName: 'Bandido',
                enemyHP: 10,
                enemyStr: 3,
                enemyCon: 2,
                position: 4,
                enemyXP: 15,
                arma: 1
              },
            },
            {
              text: "Ficar na retaguarda e coordenar as ações.",
              nextStep: "end",
              event: 'batalha',
              enemy: {
                enemyName: 'Bandido',
                enemyHP: 10,
                enemyStr: 3,
                enemyCon: 2,
                position: 5,
                enemyXP: 10,
                arma: 1
              },
            },
            {
              text:  "Tentar encontrar uma posição estratégica para emboscar os bandidos.",
              nextStep: "end",
              event: 'batalha',
              enemy: {
                enemyName: 'Líder dos Bandidos',
                enemyHP: 15,
                enemyStr: 4,
                enemyCon: 3,
                position: 3,
                enemyXP: 20,
                arma: 1
              },
            },
          ],
        },
        {
          text: "A batalha termina e os bandidos recuam. O vilarejo está seguro!",
          recompensa: {
            xp: 10
          }

          // Adicione mais etapas conforme necessário.
        },
      ],
    },
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
              text: "Entrar na caverna sem hesitação.",
              nextStep: 2,
            },
            {
              text: "Procurar pistas ao redor antes de entrar.",
              nextStep: 3,
            },
            {
              text: "Decidir não entrar e buscar ajuda em outro lugar.",
              nextStep: "end",
            },
          ],
        },
        {
          text: "Você entra na caverna e se depara com uma bifurcação. À esquerda, você ouve o som de água corrente. À direita, o som de pedras caindo. Qual caminho você escolhe?",
          options: [
            {
              text: "Ir para a esquerda, em direção ao som de água.",
              nextStep: "end",
            },
            {
              text: "Ir para a direita, onde o som de pedras ressoa.",
              nextStep: "end",
            },
          ],
        },
        {
          text: "Você encontra símbolos estranhos gravados nas pedras ao redor da caverna. Eles parecem conter uma pista sobre o artefato. O que você faz?",
          options: [
            {
              text: "Tentar decifrar os símbolos.",
              nextStep: 2,
            },
            {
              text: "Ignorar os símbolos e continuar explorando.",
              nextStep: 2,
            },
          ],
        },
      ],
    },
  ],
};
