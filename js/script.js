document.addEventListener('DOMContentLoaded', () => {
    // EventListener que é acionado quando o DOM (Document Object Model) é completamente carregado
    // É usado para garantir que o script seja executado após o carregamento do HTML, evitando erros.

    // Constantes que definem as propriedades do jogo
    const board = document.getElementById('game-board');
    const cellSize = 20;
    const gridSize = 15;
    const snakeSpeed = 200;

    // Array que representa a cobra, inicialmente com dois blocos
    let snake = [{ x: 0, y: 0 }, { x: 1, y: 0 }];

    // Objeto que representa a comida
    let food = { x: 0, y: 0 };

    // Direção inicial da cobra
    let direction = 'right';

    // Variável que controla se o jogo está encerrado
    let isGameOver = false;

    // Função que cria o tabuleiro do jogo
    function createBoard() {
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                // Criação de elementos de célula para formar o tabuleiro
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.style.width = cell.style.height = `${cellSize}px`;
                cell.style.top = `${row * cellSize}px`;
                cell.style.left = `${col * cellSize}px`;
                board.appendChild(cell);
            }
        }
    }

    // Função que desenha a cobra no tabuleiro
    function drawSnake() {
        snake.forEach(segment => {
            const snakeSegment = document.createElement('div');
            snakeSegment.className = 'snake';
            snakeSegment.style.width = snakeSegment.style.height = `${cellSize}px`;
            snakeSegment.style.top = `${segment.y * cellSize}px`;
            snakeSegment.style.left = `${segment.x * cellSize}px`;

            // Adição de um elemento interno à cobra para personalizar seu estilo
            const innerSegment = document.createElement('div');
            innerSegment.style.width = innerSegment.style.height = '100%';
            snakeSegment.appendChild(innerSegment);

            board.appendChild(snakeSegment);
        });
    }

    // Função que desenha a comida no tabuleiro
    function drawFood() {
        const foodElement = document.createElement('div');
        foodElement.className = 'food';
        foodElement.style.width = foodElement.style.height = `${cellSize}px`;
        foodElement.style.top = `${food.y * cellSize}px`;
        foodElement.style.left = `${food.x * cellSize}px`;
        board.appendChild(foodElement);
    }

    // Função que move a cobra
    function moveSnake() {
        const head = Object.assign({}, snake[0]);

        switch (direction) {
            case 'up':
                head.y -= 1;
                break;
            case 'down':
                head.y += 1;
                break;
            case 'left':
                head.x -= 1;
                break;
            case 'right':
                head.x += 1;
                break;
        }

        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            generateFood();
        } else {
            snake.pop();
        }
    }

    // Função que verifica se houve colisão com as bordas ou com a própria cobra
    function checkCollision() {
        const head = snake[0];

        if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
            isGameOver = true;
        }

        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                isGameOver = true;
                break;
            }
        }
    }

    // Função que gera a posição da comida de forma aleatória no tabuleiro
    function generateFood() {
        food.x = Math.floor(Math.random() * gridSize);
        food.y = Math.floor(Math.random() * gridSize);
    }

    // Função principal que atualiza o jogo
    function updateGame() {
        if (!isGameOver) {
            moveSnake();
            checkCollision();

            if (!isGameOver) {
                board.innerHTML = '';
                drawSnake();
                drawFood();
            }
        } else {
            alert('Game Over!');
            resetGame();
        }
    }

    // Função que reinicia o jogo
    function resetGame() {
        snake = [{ x: 0, y: 0 }, { x: 1, y: 0 }];
        direction = 'right';
        isGameOver = false;
        generateFood();
    }

 // Função que responde ao pressionar de teclas para controlar a direção da cobra
function handleKeyPress(event) {
    // Evitar movimentos opostos sucessivos
    switch (event.key) {
        case 'ArrowUp':
            if (direction !== 'down') direction = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') direction = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') direction = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') direction = 'right';
            break;
    }
}

// Inicialização do jogo
createBoard(); // Criação do tabuleiro inicial
drawSnake(); // Desenha a cobra no tabuleiro
generateFood(); // Gera a posição inicial da comida
drawFood(); // Desenha a comida no tabuleiro

// Configuração do intervalo de atualização do jogo
setInterval(updateGame, snakeSpeed);

// Adição do EventListener para lidar com pressionamento de teclas
document.addEventListener('keydown', handleKeyPress);})