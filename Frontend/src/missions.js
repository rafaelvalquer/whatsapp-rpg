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
              nextStep: 7,
              event: 'batalha',
              enemy: {
                enemyName: 'Bandido',
                enemyHP: 10,
                enemyMaxHP: 10,
                enemyStr: 3,
                enemyCon: 2,
                position: 3,
                enemyXP: 15,
                arma: 1,
                item: 101
              },
            },
            {
              text: "Ficar na retaguarda e coordenar as ações.",
              nextStep: 7,
              event: 'batalha',
              enemy: {
                enemyName: 'Bandido',
                enemyHP: 10,
                enemyMaxHP: 10,
                enemyStr: 3,
                enemyCon: 2,
                position: 5,
                enemyXP: 10,
                arma: 1,
                item: 101
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
              event: 'encontraFerido',
              nextText: "🩸 Diante de você, um viajante está caído, enfraquecido e visivelmente ferido. Seu rosto demonstra exaustão, e seus olhos refletem um pedido silencioso por ajuda.",
              enemy: {
                enemyName: 'Guerreiro Ferido',
                enemyHP: 15,
                enemyMaxHP: 15,
                enemyStr: 5,
                enemyCon: 5,
                position: 5,
                enemyXP: 10,
                arma: 5
              },
              item: 101
            },
            {
              text: "Ignorar e continuar seu caminho até o vilarejo.",
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
              nextStep: 7,
              event: 'batalha',
              enemy: {
                enemyName: 'Bandido',
                enemyHP: 10,
                enemyMaxHP: 10,
                enemyStr: 3,
                enemyCon: 2,
                position: 4,
                enemyXP: 15,
                arma: 1,
                item: 101
              },
            },
            {
              text: "Ficar na retaguarda e coordenar as ações.",
              nextStep: 7,
              event: 'batalha',
              enemy: {
                enemyName: 'Bandido',
                enemyHP: 10,
                enemyMaxHP: 10,
                enemyStr: 3,
                enemyCon: 2,
                position: 5,
                enemyXP: 10,
                arma: 1
              },
            },
            {
              text:  "Tentar encontrar uma posição estratégica para emboscar os bandidos.",
              nextStep: 7,
              event: 'batalha',
              enemy: {
                enemyName: 'Líder dos Bandidos',
                enemyHP: 15,
                enemyMaxHP: 15,
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
          text: "⚔️ A batalha termina e os bandidos recuam. O vilarejo está seguro! 🏡✨",
          options: [
            {
              text: "💰 Pegar sua recompensa",
              nextStep: "end",
            }
          ],
        },
        {
          text: "🚶‍♂️ Você decide seguir seu caminho e deixar o vilarejo de Eldoria à sua própria sorte. Com um último olhar, você se afasta, determinado a encontrar seu próprio destino.🌟",
        },
        {
          text: "🎉 Parabéns! Você foi recompensado com 10 de XP! 🌟",
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
          event: "encontroFerido",
          options: [
            {
              text: "Investigar a origem do som e verificar a situação.",
              nextStep: 8,
              event: 'encontraFerido',
              nextText: "Seguindo o som da água, você encontra um pequeno riacho subterrâneo. Perto dele, um guardião cansado está encostado em uma pedra, ofegante. 🛡️🌊😓",
              enemy: {
                enemyName: 'Guardião Cansado',
                enemyHP: 12,
                enemyMaxHP: 12,
                enemyStr: 4,
                enemyCon: 6,
                position: 4,
                enemyXP: 8,
                arma: 3
              },
              item: 102
            },
            {
              text: "Ignorá-lo e seguir em frente.",
              nextStep: 8
            }
          ]
        },



        {
          text: "Você segue pelo caminho das pedras caindo e de repente é atacado por um Goblin das Sombras!",
          options: [
            {
              text: "Enfrentar de frente.",
              nextStep: 8,
              event: 'batalha',
              enemy: {
                enemyName: 'Goblin das Sombras',
                enemyHP: 20,
                enemyMaxHP: 20,
                enemyStr: 6,
                enemyCon: 4,
                position: 3,
                enemyXP: 25,
                arma: 7
              }              
            },
            {
              text: "Tentar surprender o Goblin das Sombras",
              nextStep: 8,
              event: 'batalha',
              enemy: {
                enemyName: 'Goblin das Sombras',
                enemyHP: 20,
                enemyMaxHP: 20,
                enemyStr: 6,
                enemyCon: 4,
                position: 3,
                enemyXP: 20,
                arma: 8
              }
            },
            {
              text: "Tentar correr",
              nextStep: 9,
            }
          ]
        },
        {
          text: "Decifrando os símbolos, você descobre um padrão que parece revelar a senha para abrir a porta. Com uma pitada de mistério, você se pergunta o que está além daquela barreira.",
          options: [
            {
              text: "Tentar abrir a porta com a senha.",
              nextStep: 8,
              event: 'encontraItem',
              item: 101
            },
            {
              text: "Seguir o seu caminho",
              nextStep: 7,
            }
          ]
        },
        {
          text: "Enquanto você segue seu caminho pela caverna escura, um barulho de passos ecoa pelas paredes. De repente, um Goblin hostil emerge das sombras, pronto para o combate. 🗡️",
          options: [
            {
              text: "Enfrentar de frente.",
              nextStep: 8,
              event: 'batalha',
              enemy: {
                enemyName: 'Goblin',
                enemyHP: 20,
                enemyMaxHP: 20,
                enemyStr: 6,
                enemyCon: 2,
                position: 3,
                enemyXP: 20,
                arma: 7
              },
            },
            {
              text: "Tentar surprender o Goblin",
              nextStep: 8,
              event: 'batalha',
              enemy: {
                enemyName: 'Goblin',
                enemyHP: 20,
                enemyMaxHP: 20,
                enemyStr: 6,
                enemyCon: 2,
                position: 5,
                enemyXP: 20,
                arma: 7
              },
            },
            {
              text: "Tentar correr",
              nextStep: 9,
            }
          ]
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
              nextStep: 21,
              event: 'encontraItem',
              item: 101
            },
          ]
        },
        
        //9
        {
          text: "Enquanto você tenta correr, um brilho ameaçador aparece à sua frente. De repente, o Rei dos Goblins surge das sombras, bloqueando seu caminho.",
          options: [
            {
              text: "Enfrentar o Rei dos Goblins",
              nextStep: 8,
              event: 'batalha',
              enemy: {
                enemyName: 'Rei dos Goblin',
                enemyHP: 30,
                enemyMaxHP: 30,
                enemyStr: 8,
                enemyCon: 3,
                position: 5,
                enemyXP: 30,
                arma: 9
              },
            }
          ]
        },

        //10
        {
          text: "Ao se aproximar do pedestal, uma sombra se move rapidamente. Antes que você possa reagir, um guardião esquelético se ergue, protegendo o artefato.",
          options: [
            {
              text: "⚔️ Enfrentar o guardião.",
              nextStep: 11,
              enemy: {
                enemyName: "Guardião Esquelético",
                enemyHP: 40,
                enemyStr: 8,
                enemyCon: 8,
                position: 6,
                enemyXP: 30,
                arma: 3
              }
            },
            {
              text: "👀 Tentar se esconder e observar os movimentos do guardião.",
              nextStep: 17,
            },
          ]
        },

        //11
        {
          text: "Após derrotar o guardião, você avança para o pedestal. Ao tocar nele, o chão treme e uma parede se move, revelando um corredor escuro. Um rugido ecoa à sua frente.",
          options: [
            {
              text: "Seguir pelo corredor e enfrentar a criatura que o espera.",
              nextStep: 12,
              enemy: {
                enemyName: "Serpente das Sombras",
                enemyHP: 14,
                enemyStr: 4,
                enemyCon: 3,
                position: 7,
                enemyXP: 20,
                arma: 4
              }
            },
          ]
        },

        //12
        {
          text: "Com a Serpente derrotada, você atravessa o corredor e chega a uma câmara secreta. No centro, repousa um baú.",
          options: [
            {
              text: "Abrir o baú.",
              nextStep: 13,
              event: 'encontraItem',
              item: 101
            },
            {
              text: "Voltar e pegar o artefato.",
              nextStep: 13,
            },
          ]
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
            }
          ]
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
              item: 101
            }
          ]
        },

        //15
        {
          text: "O artefato agora está em boas mãos, e sua bravura foi reconhecida por todos. 🌟",
          options: [
            {
              text: "💰 Pegar sua recompensa",
              nextStep: "end",
            },
          ]
        },

        //16
        {
          text: "🔮 Com o artefato escondido, você retorna ao contratante e diz que não conseguiu encontrá-lo. Ele suspira, desapontado, mas reconhece seus esforços e ainda assim lhe concede uma recompensa por sua coragem. Enquanto isso, o poder do artefato permanece em suas mãos, seu segredo bem guardado. 🌟",
          options: [
            {
              text: "💰 Pegar sua recompensa",
              nextStep: "end",
            },
          ]
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
          ]
        },


        //18
        {
          text: "⚡ Você aproveita um instante em que o guardião esquelético se vira para o lado oposto e avança silenciosamente até o pedestal. Suas mãos tocam o artefato... Mas antes que possa recuá-las, um brilho fantasmagórico preenche a sala. O guardião percebe sua ação e ruge com fúria, erguendo sua lâmina enferrujada!",
          options: [
            {
              text: "⚔️ Lutar contra o guardião esquelético e defender sua vida.",
              nextStep: 20,
              enemy: {
                enemyName: "Guardião Esquelético",
                enemyHP: 40,
                enemyStr: 8,
                enemyCon: 8,
                position: 4,
                enemyXP: 30,
                arma: 3,
                item: 101
              }
            },
            {
              text: "📜 Recitar um antigo verso de um pergaminho que você encontrou.",
              nextStep: 19,
            },
            {
              text: "🚶‍♂️ Correr imediatamente para a saída e escapar com vida.",
              nextStep: "return",
            },
          ]
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
              nextStep: 21,
            }
          ]
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
              nextStep: 21,
            }
          ]
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
          ]
        },

        //22
        {
          text: "📖 As inscrições falam da 'Relíquia dos Antigos', um artefato selado há séculos. Ao decifrá-las, um painel secreto se move, revelando um baú oculto.",
          options: [
            {
              text: "Abrir o baú.",
              nextStep: 20,
              event: "encontraItem",
              item: 101
            },
            {
              text: "Ignorar o baú e focar no artefato.",
              nextStep: 20,
            }
          ]
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
            }
          ]
        },

        //FIM
        {
          text: "🚶‍♂️ Diante dos perigos desconhecidos, você decide que essa missão não vale o risco. Com um último olhar para a caverna, vira-se e retorna ao vilarejo, deixando o artefato para quem for ousado o suficiente para buscá-lo. Talvez outro desafio o aguarde na cidade... 🌆✨",
        },
        {
          text: "🎉 Parabéns! Você foi recompensado com 50 de XP! 🌟",
          recompensa: {
            xp: 50
          }

          // Adicione mais etapas conforme necessário.
        },
      ],
    },
  ],
};
