class Node {
    constructor(x, y, parent = null) {
        this.x = x;
        this.y = y;
        this.parent = parent;
        this.g = 0; // Custo do caminho do início até este nó
        this.h = 0; // Estimativa do custo do caminho deste nó até o objetivo
        this.f = 0; // Custo total (g + h)
    }

    equals(other) {
        return this.x === other.x && this.y === other.y;
    }
}

class AStarSearch {
    constructor(start, goal, environment) {
        this.start = new Node(start.x, start.y);
        this.goal = new Node(goal.x, goal.y);
        this.environment = environment;
        this.openSet = [this.start];
        this.closedSet = [];
        this.nodes = new Map(); // Armazena os nós para acesso rápido
        this.nodes.set(this.nodeKey(this.start), this.start);
        this.nodesVisited = new Set();
        this.frontier = new Set();
    }

    nodeKey(node) {
        return `${node.x},${node.y}`;
    }

    heuristic(node, goal) {
        return Math.abs(node.x - goal.x) + Math.abs(node.y - goal.y);
    }

    findPath() {
        this.frontier.add(this.nodeKey(this.start)); // Adiciona o ponto inicial à fronteira

        while (this.openSet.length > 0) {
            let current = this.openSet.reduce((a, b) => a.f < b.f ? a : b);
            this.nodesVisited.add(this.nodeKey(current));
            this.frontier.delete(this.nodeKey(current)); // Remove o nó atual da fronteira

            if (current.equals(this.goal)) {
                this.path = this.reconstructPath(current);
                return this.path;
            }

            this.openSet = this.openSet.filter(n => n !== current);
            this.closedSet.push(current);

            let neighbors = this.getNeighbors(current);
            for (let neighbor of neighbors) {
                if (this.closedSet.some(n => n.equals(neighbor))) {
                    continue;
                }

                let tentative_g = current.g + this.environment.getCostOfTerrainAt(neighbor.x, neighbor.y);
                let neighborKey = this.nodeKey(neighbor);

                if (!this.openSet.some(n => n.equals(neighbor))) {
                    this.openSet.push(neighbor);
                    this.frontier.add(neighborKey); // Adiciona novos vizinhos à fronteira
                } else if (tentative_g >= neighbor.g) {
                    continue;
                }

                neighbor.parent = current;
                neighbor.g = tentative_g;
                neighbor.h = this.heuristic(neighbor, this.goal);
                neighbor.f = neighbor.g + neighbor.h;
            }
        }

        return []; // Caminho não encontrado
    }

    getNeighbors(node) {
        let neighbors = [];
        let directions = [
            { x: 1, y: 0 },  // direita
            { x: -1, y: 0 }, // esquerda
            { x: 0, y: 1 },  // abaixo
            { x: 0, y: -1 }  // acima
        ];

        for (let dir of directions) {
            let nx = node.x + dir.x;
            let ny = node.y + dir.y;

            if (nx >= 0 && nx < this.environment.cols && ny >= 0 && ny < this.environment.rows) {
                let newNode = this.nodes.get(this.nodeKey({ x: nx, y: ny }));
                if (!newNode) {
                    newNode = new Node(nx, ny);
                    this.nodes.set(this.nodeKey(newNode), newNode);
                }
                if (this.environment.grid[ny][nx] !== 0) { // Certifique-se de que não é um obstáculo
                    neighbors.push(newNode);
                }
            }
        }

        return neighbors;
    }

    reconstructPath(goalNode) {
        let path = [];
        let currentNode = goalNode;
        while (currentNode !== null) {
            path.unshift({ x: currentNode.x, y: currentNode.y });
            currentNode = currentNode.parent;
        }
        return path;
    }
}

class UniformCostSearch {
    constructor(start, goal, environment) {
        this.start = new Node(start.x, start.y);
        this.goal = new Node(goal.x, goal.y);
        this.environment = environment;
        this.openSet = [this.start];
        this.closedSet = [];
        this.nodes = new Map(); // Armazena os nós para acesso rápido
        this.nodes.set(this.nodeKey(this.start), this.start);
        this.path = [];
        this.nodesVisited = new Set();
        this.frontier = new Set();
    }

    nodeKey(node) {
        return `${node.x},${node.y}`;
    }

    findPath() {
        this.frontier.add(this.nodeKey(this.start)); // Adiciona o ponto inicial à fronteira

        while (this.openSet.length > 0) {
            let current = this.openSet.reduce((a, b) => a.g < b.g ? a : b);
            this.nodesVisited.add(this.nodeKey(current));
            this.frontier.delete(this.nodeKey(current)); // Remove o nó atual da fronteira

            if (current.equals(this.goal)) {
                this.path = this.reconstructPath(current);
                return this.path;
            }

            this.openSet = this.openSet.filter(n => n !== current);
            this.closedSet.push(current);

            let neighbors = this.getNeighbors(current);
            for (let neighbor of neighbors) {
                if (this.closedSet.some(n => n.equals(neighbor))) {
                    continue;
                }

                let tentative_g = current.g + this.environment.getCostOfTerrainAt(neighbor.x, neighbor.y);

                if (!this.openSet.some(n => n.equals(neighbor))) {
                    this.openSet.push(neighbor);
                    this.frontier.add(this.nodeKey(neighbor)); // Adiciona novos vizinhos à fronteira
                } else if (tentative_g >= neighbor.g) {
                    continue;
                }

                neighbor.parent = current;
                neighbor.g = tentative_g;
            }
        }
        return []; // Caminho não encontrado
    }
  
    getNeighbors(node) {
        let neighbors = [];
        let directions = [
            { x: 1, y: 0 },  // direita
            { x: -1, y: 0 }, // esquerda
            { x: 0, y: 1 },  // abaixo
            { x: 0, y: -1 }  // acima
        ];

        for (let dir of directions) {
            let nx = node.x + dir.x;
            let ny = node.y + dir.y;

            if (nx >= 0 && nx < this.environment.cols && ny >= 0 && ny < this.environment.rows) {
                let newNode = this.nodes.get(this.nodeKey({ x: nx, y: ny }));
                if (!newNode) {
                    newNode = new Node(nx, ny);
                    this.nodes.set(this.nodeKey(newNode), newNode);
                }
                if (this.environment.grid[ny][nx] !== 0) { // Certifique-se de que não é um obstáculo
                    neighbors.push(newNode);
                }
            }
        }

        return neighbors;
    }

    reconstructPath(goalNode) {
        let path = [];
        let currentNode = goalNode;
        while (currentNode !== null) {
            path.unshift({ x: currentNode.x, y: currentNode.y });
            currentNode = currentNode.parent;
        }
        return path;
    }
}

class GreedyBestFirstSearch {
    constructor(start, goal, environment) {
        this.start = new Node(start.x, start.y);
        this.goal = new Node(goal.x, goal.y);
        this.environment = environment;
        this.openSet = [this.start];
        this.closedSet = [];
        this.nodes = new Map();
        this.nodes.set(this.nodeKey(this.start), this.start);
        this.path = [];
        this.nodesVisited = new Set();
        this.frontier = new Set();
    }

    nodeKey(node) {
        return `${node.x},${node.y}`;
    }

    heuristic(node) {
        return Math.abs(node.x - this.goal.x) + Math.abs(node.y - this.goal.y);
    }

    findPath() {
        this.frontier.add(this.nodeKey(this.start)); // Adiciona o ponto inicial à fronteira

        while (this.openSet.length > 0) {
            let current = this.openSet.reduce((a, b) => this.heuristic(a) < this.heuristic(b) ? a : b);
            this.nodesVisited.add(this.nodeKey(current));
            this.frontier.delete(this.nodeKey(current)); // Remove o nó atual da fronteira

            if (current.equals(this.goal)) {
                this.path = this.reconstructPath(current);
                return this.path;
            }

            this.openSet = this.openSet.filter(n => n !== current);
            this.closedSet.push(current);

            let neighbors = this.getNeighbors(current);
            for (let neighbor of neighbors) {
                let key = this.nodeKey(neighbor);
                if (this.closedSet.some(n => n.equals(neighbor)) || this.openSet.some(n => n.equals(neighbor))) {
                    continue;
                }

                neighbor.parent = current;
                this.openSet.push(neighbor);
                this.frontier.add(key); // Adiciona novos vizinhos à fronteira
            }
        }
        return []; // Caminho não encontrado
    }
  
    getNeighbors(node) {
        let neighbors = [];
        let directions = [
            { x: 1, y: 0 },  // direita
            { x: -1, y: 0 }, // esquerda
            { x: 0, y: 1 },  // abaixo
            { x: 0, y: -1 }  // acima
        ];

        for (let dir of directions) {
            let nx = node.x + dir.x;
            let ny = node.y + dir.y;

            if (nx >= 0 && nx < this.environment.cols && ny >= 0 && ny < this.environment.rows) {
                let newNode = this.nodes.get(this.nodeKey({ x: nx, y: ny }));
                if (!newNode) {
                    newNode = new Node(nx, ny);
                    this.nodes.set(this.nodeKey(newNode), newNode);
                }
                if (this.environment.grid[ny][nx] !== 0) { // Certifique-se de que não é um obstáculo
                    neighbors.push(newNode);
                }
            }
        }

        return neighbors;
    }

    reconstructPath(goalNode) {
        let path = [];
        let currentNode = goalNode;
        while (currentNode !== null) {
            path.unshift({ x: currentNode.x, y: currentNode.y });
            currentNode = currentNode.parent;
        }
        return path;
    }
}

class DepthFirstSearch {
    constructor(start, goalPosition, environment) {
        this.start = start;
        this.goalPosition = goalPosition;
        this.environment = environment;
        this.stack = []; // Pilha para DFS
        this.visited = new Set(); // Conjunto de nós visitados
        this.path = []; // Caminho encontrado
        this.nodesVisited = new Set();
        this.frontier = new Set();
    }
  
    findPath() {
        this.start.previous = null;
        this.stack.push(this.start);
        this.visited.add(this.nodeKey(this.start));
        this.nodesVisited.add(this.nodeKey(this.start));
        this.frontier.add(this.nodeKey(this.start)); // Adiciona o ponto inicial à fronteira

        while (this.stack.length > 0) {
            let current = this.stack.pop();
            let currentKey = this.nodeKey(current);
            this.nodesVisited.add(currentKey); // Adiciona o nó atual aos nós visitados
            this.frontier.delete(currentKey); // Remove o nó atual da fronteira

            if (current.x === this.goalPosition.x && current.y === this.goalPosition.y) {
                return this.reconstructPath(current);
            }

            let neighbors = this.getNeighbors(current);
            for (let neighbor of neighbors) {
                let key = this.nodeKey(neighbor);
                if (!this.visited.has(key)) {
                    neighbor.previous = current;
                    this.stack.push(neighbor);
                    this.visited.add(key);
                    this.frontier.add(key); // Adiciona novos vizinhos à fronteira
                }
            }
        }
        return []; // Caminho não encontrado
    }
  
    reconstructPath(goalNode) {
        let temp = goalNode;
        let path = [];
        while (temp) {
            path.unshift({ x: temp.x, y: temp.y });
            temp = temp.previous;
        }
        this.path = path;
        return path;
    }
  
    getNeighbors(node) {
            let neighbors = [];
            let directions = [
                createVector(1, 0),  // direita
                createVector(-1, 0), // esquerda
                createVector(0, 1),  // abaixo
                createVector(0, -1)  // acima
                // Inclua diagonais se necessário
            ];

            for (let dir of directions) {
                let neighborRow = node.y + dir.y;
                let neighborCol = node.x + dir.x;

                if (neighborRow >= 0 && neighborRow < this.environment.rows &&
                    neighborCol >= 0 && neighborCol < this.environment.cols &&
                    this.environment.grid[neighborRow][neighborCol] !== 0) { // 0 é um obstáculo

                    neighbors.push({ x: neighborCol, y: neighborRow, previous: null });
                }
            }

            return neighbors;
        }

    nodeKey(node) {
        // Cria uma chave única para cada nó para rastreamento
        return `${node.x},${node.y}`;
    }
}

class BreadthFirstSearch {
    constructor(start, goalPosition, environment) {
        this.start = start;
        this.goalPosition = goalPosition;
        this.environment = environment;
        this.queue = []; // Fila para BFS
        this.visited = new Set(); // Conjunto de nós visitados
        this.path = []; // Caminho encontrado
        this.nodesVisited = new Set();
        this.frontier = new Set();
    }


    findPath() {
        this.start.previous = null;
        this.queue.push(this.start);
        this.visited.add(this.nodeKey(this.start));
        this.frontier.add(this.nodeKey(this.start)); // Adiciona o ponto inicial à fronteira

        while (this.queue.length > 0) {
            let current = this.queue.shift();
            let currentKey = this.nodeKey(current);
            this.frontier.delete(currentKey); // Remove o nó atual da fronteira

            if (current.x === this.goalPosition.x && current.y === this.goalPosition.y) {
                return this.reconstructPath(current);
            }

            let neighbors = this.getNeighbors(current);
            for (let neighbor of neighbors) {
                let key = this.nodeKey(neighbor);
                if (!this.visited.has(key)) {
                    neighbor.previous = current;
                    this.queue.push(neighbor);
                    this.visited.add(key);
                    this.frontier.add(key); // Adiciona novos vizinhos à fronteira
                }
            }
        }
        return []; // Caminho não encontrado
    }

    reconstructPath(goalNode) {
        let temp = goalNode;
        let path = [];
        while (temp) {
            path.unshift({ x: temp.x, y: temp.y }); // Adiciona ao início do array
            temp = temp.previous;
        }
        this.path = path;
        return path;
    }

    getNeighbors(node) {
            let neighbors = [];
            let directions = [
                createVector(1, 0),  // direita
                createVector(-1, 0), // esquerda
                createVector(0, 1),  // abaixo
                createVector(0, -1)  // acima
                // Inclua diagonais se necessário
            ];

            for (let dir of directions) {
                let neighborRow = node.y + dir.y;
                let neighborCol = node.x + dir.x;

                if (neighborRow >= 0 && neighborRow < this.environment.rows &&
                    neighborCol >= 0 && neighborCol < this.environment.cols &&
                    this.environment.grid[neighborRow][neighborCol] !== 0) { // 0 é um obstáculo

                    neighbors.push({ x: neighborCol, y: neighborRow, previous: null });
                }
            }

            return neighbors;
        }

    nodeKey(node) {
        return `${node.x},${node.y}`;
    }
}
