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

    // Pegando as armas equipadas pelo jogador
    const arma1 = this.player.status.arma1 ? items[this.player.status.arma1] : null;
    const arma2 = this.player.status.arma2 ? items[this.player.status.arma2] : null;

    // Pegando os atributos das armas (se existirem)
    const poderAtaque1 = arma1 ? arma1.str : 0;
    const poderAtaque2 = arma2 ? arma2.str : 0;
        
    if (Math.abs(this.playerPosition - this.enemyPosition) === 1) {
      // Dano base + dano das armas
      const danoBase = Math.max(this.player.status.str - this.enemy.enemyCon, 1);
      const damage = danoBase + poderAtaque1 + poderAtaque2; 

      // Reduzindo HP do inimigo
      this.enemy.enemyHP -= damage;

      if (this.enemy.enemyHP <= 0) {
        const xp = this.enemy.enemyXP;
        this.player.status.xp += xp;
        return `${this.player.name} atacou o inimigo e causou *${damage}* de dano! O ${this.enemy.enemyName} foi derrotado! 🎉
Você ganhou *${xp}* de experiência! 🏆`;
    }

      return `${this.player.name} atacou o inimigo e causou *${damage}* de dano! HP do ${this.enemy.enemyName} restante: ${this.enemy.enemyHP}`;
    } else {
      return "O inimigo está muito longe para atacar!";
    }
  }

  // Lógica de movimento e ataque do inimigo
  enemyAction() {

    // Pegando as armas do jogador
    const arma1 = this.player.status.arma1 ? armas[this.player.status.arma1] : null;
    const arma2 = this.player.status.arma2 ? armas[this.player.status.arma2] : null;

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
