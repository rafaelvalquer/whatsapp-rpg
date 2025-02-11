const items = require("./armas.json"); // Importa o JSON

class BattleSystem {
  constructor(gridSize, playerPosition, player, enemy) {
    this.gridSize = gridSize;
    this.player = player;
    this.enemy = enemy;
    this.playerPosition = playerPosition;
    this.enemyPosition = enemy.position;

    console.log('Player = ' + JSON.stringify(player))
    console.log('Enemy = ' + JSON.stringify(enemy))
  }

  movePlayer(direction) {
    const newPosition = this.playerPosition + direction;

    // Verificar se a nova posição está dentro dos limites do grid
    if (newPosition >= 0 && newPosition < this.gridSize) {
      // Verificar se a nova posição não contém o inimigo
      if (newPosition === this.enemyPosition) {
        return "O jogador não pode se mover para a posição do inimigo!";
      }

      this.playerPosition = newPosition;
      return `Jogador movido para posição ${this.playerPosition}`;
    } else {
      return "O jogador não pode se mover nessa direção!";
    }
  }

  playerAttack() {

    //Verificar distancia do Player com o inimigo
    const distancia = Math.abs(this.playerPosition - this.enemyPosition);

    // Pegando as armas equipadas pelo jogador
    const arma1 = this.player.status.arma1 ? items[this.player.status.arma1] : null;
    const arma2 = this.player.status.arma2 ? items[this.player.status.arma2] : null;

    // Declarando as variáveis corretamente
    let poderArma1 = 0;
    let poderArma2 = 0;

    // Pegando os atributos das armas (se existirem)
    if (this.player.classe === "guerreiro") {
      poderArma1 = arma1 ? arma1.str : 0;
      poderArma2 = arma2 ? arma2.str : 0;
    } else if (this.player.classe === "arqueiro") {
      poderArma1 = arma1 ? arma1.agi : 0;
      poderArma2 = arma2 ? arma2.agi : 0;
    } else if (this.player.classe === "mago") {
      poderArma1 = arma1 ? arma1.int : 0;
      poderArma2 = arma2 ? arma2.int : 0;
    }


    if (this.player.classe === "guerreiro") {
      if (distancia === 1) {
  
        // Dano base + dano das armas
        const danoBase = Math.max(this.player.status.str - this.enemy.enemyCon, 1);
        const damage = danoBase + poderArma1 + poderArma2;

        // Reduzindo HP do inimigo
        this.enemy.enemyHP -= damage;

        return this.verificarInimigoDerrotado(damage);
      } else {
        return "O inimigo está muito longe para atacar!";
      }
    }
    if (this.player.classe === "arqueiro") {
      if (distancia >= 1 && distancia <= 3) {
        let danoBase = Math.max(this.player.status.agi - this.enemy.enemyCon, 1);
        if (distancia === 1) danoBase = Math.max(this.player.status.str - this.enemy.enemyCon, 1); // Se estiver perto, usa STR
  
        const damage = danoBase + poderArma1 + poderArma2;
        this.enemy.enemyHP -= damage;
        return this.verificarInimigoDerrotado(damage);
      } else {
        return "O inimigo está fora do alcance do seu arco!";
      }
    }
    if (this.player.classe === "mago") {
      if (distancia >= 1 && distancia <= 5) {
        let danoBase = Math.max(this.player.status.int - this.enemy.enemyCon, 1);
        if (distancia === 1) danoBase = Math.max(this.player.status.str - this.enemy.enemyCon, 1); // Se estiver perto, usa STR
  
        const damage = danoBase + poderArma1 + poderArma2;
        this.enemy.enemyHP -= damage;
        return this.verificarInimigoDerrotado(damage);
      } else {
        return "O inimigo está muito longe para sua magia!";
      }
    }
  }

  verificarInimigoDerrotado(damage) {
    if (this.enemy.enemyHP <= 0) {
      const xp = this.enemy.enemyXP;
      this.player.status.xp += xp;
      return `${this.player.name} atacou o inimigo e causou *${damage}* de dano! O ${this.enemy.enemyName} foi derrotado! 🎉
Você ganhou *${xp}* de experiência! 🏆`;
    }
    return `${this.player.name} atacou o inimigo e causou *${damage}* de dano! HP do ${this.enemy.enemyName} restante: ${this.enemy.enemyHP}`;
  }

  // Lógica de movimento e ataque do inimigo
  enemyAction() {

    // Pegando as armas do jogador
    const arma1 = this.player.status.arma1 ? items[this.player.status.arma1] : null;
    const arma2 = this.player.status.arma2 ? items[this.player.status.arma2] : null;

    // Pegando os atributos das armas (se existirem)
    const defesaArma1 = arma1 ? arma1.con : 0;
    const defesaArma2 = arma2 ? arma2.con : 0;

    // Defesa total do jogador (constituição + defesa das armas)
    const defesaTotal = this.player.status.con + defesaArma1 + defesaArma2;

    // Se o inimigo já está ao lado do jogador, ele ataca e não se move
    if (Math.abs(this.enemyPosition - this.playerPosition) === 1) {
      const damage = Math.max(this.enemy.enemyStr - defesaTotal, 1);
      this.player.status.hp -= damage;

      if (this.player.status.hp <= 0) {
        return `O ${this.enemy.enemyName} atacou o ${this.player.name} e causou *${damage}* de dano! Você morreu! ☠️`;
    }

      return `O ${this.enemy.enemyName} atacou o ${this.player.name} e causou *${damage}* de dano! HP do jogador restante: ${this.player.status.hp}`;
    }

    // Se o inimigo não está ao lado do jogador, ele se move em direção ao jogador
    if (this.enemyPosition < this.playerPosition) {
      this.enemyPosition += 1;
    } else if (this.enemyPosition > this.playerPosition) {
      this.enemyPosition -= 1;
    }

    return "O inimigo se aproximou do jogador.";
  }


  displayGrid() {
    const grid = new Array(this.gridSize).fill("[0]");
    grid[this.playerPosition] = "[🗡️]";
    grid[this.enemyPosition] = "[🐉]";
    return grid.join("");
  }
}

module.exports = BattleSystem;
