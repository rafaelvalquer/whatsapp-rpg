class BattleSystem {
  constructor(gridSize, playerPosition, player, enemy) {
    this.gridSize = gridSize;
    this.player = player;
    this.enemy = enemy;
    this.playerPosition = playerPosition;
    this.enemyPosition = enemy.position;
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
      if (Math.abs(this.playerPosition - this.enemyPosition) === 1) {
        const damage = Math.max(this.player.status.str - this.enemy.enemyCon, 1);
        this.enemy.enemyHP -= damage;
        return `O jogador atacou o inimigo e causou ${damage} de dano! HP do inimigo restante: ${this.enemy.enemyHP}`;
      } else {
        return "O inimigo está muito longe para atacar!";
      }
    }

  // Lógica de movimento e ataque do inimigo
  enemyAction() {
    // Movendo o inimigo em direção ao jogador
    if (this.enemyPosition < this.playerPosition) {
      this.enemyPosition += 1;
    } else if (this.enemyPosition > this.playerPosition) {
      this.enemyPosition -= 1;
    }

    // Se o inimigo está ao lado do jogador, ele ataca
    if (Math.abs(this.enemyPosition - this.playerPosition) === 1) {
      const damage = Math.max(this.enemy.enemyStr - this.player.status.con, 1);
      this.player.status.hp -= damage;
      return `O inimigo atacou o jogador e causou ${damage} de dano! HP do jogador restante: ${this.player.status.hp}`;
    } else {
      return "O inimigo se aproximou do jogador.";
    }
  }
  
    displayGrid() {
      const grid = new Array(this.gridSize).fill("[0]");
      grid[this.playerPosition] = "[🗡️]";
      grid[this.enemyPosition] = "[🐉]";
      return grid.join("");
    }
  }
  
  module.exports = BattleSystem;
  