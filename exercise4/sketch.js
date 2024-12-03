let environment;
let agent;
let goal;
let bfs;
let dfs;
let aStar;
let uniform;
let greedy;
let cellSize = 20;
let selected = 1; // Padrão: BFS
let i = 0;
let counter = 0; 
let foundPath = false
let path; 
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function setup() {
    createCanvas(400, 400);
    environment = new Environment(width / cellSize, height / cellSize);
    agent = new Agent(environment);
    goal = new Goal(environment);
}
  

function draw() {
    background(220);
    environment.display();
    agent.display();
    goal.display();
    // Desenha o caminho e outros elementos com base na escolha do usuário
    switch (selected) {
        case 1:
            if (bfs) {
                if (bfs.path) {
                    drawPath(bfs.path);
                }
                agent.path = bfs.path
                drawVisitedSquares(bfs.visited);
                drawFrontier(bfs.frontier);
            }
            break;
        case 2:
            if (dfs) {
                if (dfs.path) {
                    drawPath(dfs.path);
                }
                agent.path = dfs.path
                drawVisitedSquares(dfs.visited);
                drawFrontier(dfs.frontier);
            }
            break;
        case 3:
            if (aStar) {
                if (aStar.path) {
                    drawPath(aStar.path);
                }
                agent.path = aStar.path
                drawVisitedSquares(aStar.nodesVisited);
                drawFrontier(aStar.frontier);
            }
            break;
        case 4:
            if (uniform) {
                if (uniform.path) {
                    drawPath(uniform.path);
                }
                agent.path = uniform.path
                drawVisitedSquares(uniform.nodesVisited);
                drawFrontier(uniform.frontier);
            }
            break;
        case 5:
            if (greedy) {
                foundPath = false
                if (greedy.path) {
                    drawPath(greedy.path);
                }
                path = greedy.path
                agent.path = path
                drawVisitedSquares(greedy.nodesVisited);
                drawFrontier(greedy.frontier);
                foundPath = true;
            }
            break;
    }
    
    if(!agent.move()) {
        counter++;
        document.getElementById("counter").innerHTML = counter
        startSearch()
    }
}

function startSearch() {
    // Captura a escolha do usuário
    selected = int(document.getElementById('searchType').value);

    // Reinicializa o ambiente e agent
    environment = new Environment(width / cellSize, height / cellSize);
    agent = new Agent(environment);
    goal = new Goal(environment);

    // Inicialize os nós de start e goal com as propriedades necessárias
    let startNode = { x: floor(agent.position.x), y: floor(agent.position.y), f: 0, g: 0, h: 0, previous: undefined };
    let goalNode = { x: goal.position.x, y: goal.position.y, f: 0, g: 0, h: 0, previous: undefined };

    // Inicializa o algoritmo de busca com base na escolha do usuário
    switch (selected) {
        case 1:
            bfs = new BreadthFirstSearch(startNode, goalNode, environment);
            bfs.findPath();
            break;
        case 2:
            dfs = new DepthFirstSearch(startNode, goalNode, environment);
            dfs.findPath();
            break;
        case 3:
            aStar = new AStarSearch(startNode, goalNode, environment);
            aStar.findPath();
            break;
        case 4:
            uniform = new UniformCostSearch(startNode, goalNode, environment);
            uniform.findPath();
            break;
        case 5:
            greedy = new GreedyBestFirstSearch(startNode, goalNode, environment);
            greedy.findPath();
            break;
    }
}

function drawVisitedSquares(visited) {
    fill(255, 0, 0, 100);
    noStroke();

    for (let key of visited) {
        let [x, y] = key.split(',').map(Number);
        rect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
    stroke(0, 0, 0);
}

function drawFrontier(frontier) {
    fill(50, 50, 50, 120);
    noStroke();

    for (let key of frontier) {
        let [x, y] = key.split(',').map(Number);
        rect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
    stroke(0, 0, 0);
    
}

function drawPath(path) {
    if (path && path.length > 0) {
        noFill();
        stroke(255, 0, 0);
        strokeWeight(3);
        beginShape();
        for (let node of path) {
            vertex(node.x * cellSize + cellSize / 2, node.y * cellSize + cellSize / 2);
        }
        endShape();
        stroke(0, 0, 0);
    }
}