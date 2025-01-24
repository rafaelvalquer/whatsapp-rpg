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
              event: 'batalha',
              enemy: {
                enemyName: 'Orc',
                enemyHP: 10,
                enemyStr: 3,
                enemyCon: 2,
                position: 5
              }
            },
            {
              text: "Negociar uma recompensa antes de ajudar.",
              nextStep: 3,
            },
            {
              text: "Recusar a ajuda e seguir seu caminho.",
              nextStep: "end",
            },
          ],
        },
        {
          text: "Você aceitou ajudar imediatamente. Os aldeões estão aliviados e contam com você para liderar a defesa. O que você faz?",
          options: [
            {
              text: "Organizar os aldeões para a defesa.",
              nextStep: 4,
            },
            {
              text: "Preparar uma emboscada para os inimigos.",
              nextStep: 5,
            },
          ],
        },
        {
          text: "Você decidiu negociar. Os aldeões, desesperados, oferecem suas economias e comida. O que você faz?",
          options: [
            {
              text: "Aceitar a recompensa e ajudar.",
              nextStep: 2,
            },
            {
              text: "Recusar e ajudar mesmo assim.",
              nextStep: 2,
            },
          ],
        },
        {
          text: "Os aldeões se reúnem sob sua liderança. Você percebe que eles não têm experiência em combate. O que você faz?",
          options: [
            {
              text: "Treinar os aldeões rapidamente.",
              nextStep: 6,
            },
            {
              text: "Buscar ajuda de guerreiros experientes na cidade próxima.",
              nextStep: 7,
            },
          ],
        },
        {
          text: "Você prepara uma emboscada. Com astúcia, posiciona os aldeões em locais estratégicos. O que você faz agora?",
          options: [
            {
              text: "Dar o sinal para atacar quando os bandidos chegarem.",
              nextStep: 8,
            },
            {
              text: "Esperar e observar o movimento dos bandidos primeiro.",
              nextStep: 9,
            },
          ],
        },
        {
          text: "Você treinou os aldeões rapidamente. Eles estão nervosos, mas prontos para lutar. A batalha começa! O que você faz?",
          options: [
            {
              text: "Liderar o ataque frontal contra os bandidos.",
              nextStep: 10,
            },
            {
              text: "Ficar na retaguarda e coordenar as ações.",
              nextStep: 11,
            },
          ],
        },
        {
          text: "...",
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
