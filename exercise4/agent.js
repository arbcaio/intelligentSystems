class Agent {
    constructor(environment) {
        this.environment = environment;
        this.position = this.findValidStartPosition();
        this.energy = 100; // Um valor inicial para a energia do agente
        // Adicione outras propriedades necessárias
    }

    findValidStartPosition() {
        // Encontra uma posição de início válida que não seja um obstáculo
        let row, col;
        do {
            row = floor(random(this.environment.rows));
            col = floor(random(this.environment.cols));
        } while (this.environment.grid[row][col] === 0); // 0 representa um obstáculo

        return createVector(col, row);
    }

    move(targetPosition) {
        // Implemente a lógica de movimentação do agente
        // Por exemplo, um simples movimento em direção ao targetPosition
        this.position.lerp(targetPosition, 0.05); // 0.05 é a taxa de interpolação
        // Reduzir energia com base no tipo de terreno
        let terrainType = this.environment.grid[this.position.y][this.position.x];
        this.adjustEnergyBasedOnTerrain(terrainType);
    }

    adjustEnergyBasedOnTerrain(terrainType) {
        // Ajusta a energia com base no tipo de terreno
        switch (terrainType) {
            case 1: this.energy -= 1; break; // Areia
            case 2: this.energy -= 5; break; // Atoleiro
            case 3: this.energy -= 10; break; // Água
            // Não subtrai energia para obstáculo (0), pois o agente não deve estar lá
        }
    }

    display() {
        // Desenha o agente no canvas
        fill(255, 0, 0); // Vermelho para o agente
        ellipse(this.position.x * cellSize + cellSize / 2, this.position.y * cellSize + cellSize / 2, cellSize * 0.8);
    }

    // Você pode adicionar mais métodos conforme necessário
}
