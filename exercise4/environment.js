class Environment {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.grid = this.initializeGrid();
        this.terrainCosts = { 0: 1, 1: 1, 2: 10, 3: 100 }; // mudar o custo do terreno 
        // 0 é obstaculo, não muda nada. 1 é amarelo (areia), 2 é verde (atoleiro), 3 é azul (agua) 
    }

    initializeGrid() {
        let grid = new Array(this.rows);
        let noiseScale = 0.1; // Ajuste este valor para alterar a "escala" do ruído

        for (let i = 0; i < this.rows; i++) {
            grid[i] = new Array(this.cols);
            for (let j = 0; j < this.cols; j++) {
                let noiseValue = noise(i * noiseScale, j * noiseScale);
                grid[i][j] = this.terrainTypeFromNoise(noiseValue);
            }
        }
        return grid;
    }

    terrainTypeFromNoise(noiseValue) {

      if (noiseValue < 0.3) {
            return 0; // Obstáculo
        } else if (noiseValue < 0.5) {
            return 1; // Areia
        } else if (noiseValue < 0.7) {
            return 2; // Atoleiro
        } else {
            return 3; // Água
        }
    }

    display() {
        // Desenha o grid e os terrenos no canvas
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.drawTerrain(i, j, this.grid[i][j]);
            }
        }
    }

    drawTerrain(row, col, terrainType) {
        strokeWeight(3);
        fill(this.getTerrainColor(terrainType));
        rect(col * cellSize, row * cellSize, cellSize, cellSize);
    }

    getTerrainColor(terrainType) {
        switch (terrainType) {
            case 0: return color(10); // Preto para obstáculo
            case 1: return color(255, 204, 0); // Amarelo para areia
            case 2: return color(0, 200, 0); // Verde para atoleiro
            case 3: return color(0, 0, 255); // Azul para água
            default: return color(255); // Branco para default
        }
    }
  
    getTerrainCost(terrainType) {
        return this.terrainCosts[terrainType] || 0;
    }
  
    getCostOfTerrainAt(x, y) {
        if (x >= 0 && x < this.cols && y >= 0 && y < this.rows) {
            let terrainType = this.grid[y][x]; 
            return this.getTerrainCost(terrainType); 
        }
        return Infinity; 
    }
}
