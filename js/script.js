document.addEventListener('DOMContentLoaded', () => {
    // EventListener que é acionado quando o DOM (Document Object Model) é completamente carregado
        // É usado para garantir que o script seja executado após o carregamento do HTML, evitando erros.

    // Elementos do jogo
    const board = document.getElementById('game-board');
    const scoreElement = document.getElementById('score');
    const topScoresContainer = document.getElementById('top-scores');
    

    // Constantes que definem as propriedades do jogo
    const cellSize = 20;
    const gridSize = 15;
    const snakeSpeed = 200;

    // Estado do jogo
        // Array que representa a cobra, inicialmente com dois blocos
    let snake = [{ x: 0, y: 0 }, { x: 1, y: 0 }];
         // Objeto que representa a comida
    let food = { x: 0, y: 0 };
        // Direção inicial da cobra
    let direction = 'right';
        // Variável que controla se o jogo está encerrado
    let isGameOver = false;
        // Inicialização score
    let score = 0;
        // Array topScores
    let topScores = [];
        // Boolean evitando loop de início
    let initialsPrompted = false;

    // Função para criar o tabuleiro do jogo
    function createBoard() {
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.style.width = cell.style.height = `${cellSize}px`;
                cell.style.top = `${row * cellSize}px`;
                cell.style.left = `${col * cellSize}px`;
                board.appendChild(cell);
            }
        }
    }

    // Função para desenhar a cobra no tabuleiro
    function drawSnake() {
        snake.forEach(segment => {
            const snakeSegment = document.createElement('div');
            snakeSegment.className = 'snake';
            snakeSegment.style.width = snakeSegment.style.height = `${cellSize}px`;
            snakeSegment.style.top = `${segment.y * cellSize}px`;
            snakeSegment.style.left = `${segment.x * cellSize}px`;

            const innerSegment = document.createElement('div');
            innerSegment.style.width = innerSegment.style.height = '100%';
            snakeSegment.appendChild(innerSegment);

            board.appendChild(snakeSegment);
        });
    }

    // Função para desenhar a comida no tabuleiro
    function drawFood() {
        const foodElement = document.createElement('div');
        foodElement.className = 'food';
        foodElement.style.width = foodElement.style.height = `${cellSize}px`;
        foodElement.style.top = `${food.y * cellSize}px`;
        foodElement.style.left = `${food.x * cellSize}px`;
        board.appendChild(foodElement);
    }

    // Função para movimentar a cobra
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
            increaseScore();
        } else {
            snake.pop();
        }
    }

    // Função para verificar colisões com a parede ou com o próprio corpo
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

    // Função para gerar comida em uma posição aleatória
    function generateFood() {
        food.x = Math.floor(Math.random() * gridSize);
        food.y = Math.floor(Math.random() * gridSize);
    }

    // Função principal para atualizar o jogo
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
            if (!initialsPrompted) {
                initialsPrompted = true;
                // Pede as iniciais do jogador e salva o score
                const playerName = prompt(`Game Over! Seu Score: ${score}. Digite suas iniciais (até 3 letras):`);
                if (playerName != '') {
                    saveScore(playerName.toUpperCase().slice(0,3));
                }
                
                resetGame();
            }
        }
    }

    // Função para aumentar a pontuação
    function increaseScore() {
        score++;
        scoreElement.innerText = score;
    }

    // Função para salvar a pontuação do jogador nos top scores
    function saveScore(playerName) {
        const player = { name: playerName, score: score };
        topScores.push(player);

        topScores.sort((a, b) => b.score - a.score);

        topScores = topScores.slice(0, 5);

        // Atualiza o conteúdo da div com os topScores
        updateTopScores();
    }

    // Função para resetar o jogo
    function resetGame() {
        initialsPrompted = false
        score=0
        scoreElement.innerText = score;
        snake = [{ x: 0, y: 0 }, { x: 1, y: 0 }];
        direction = 'right';
        isGameOver = false;
        generateFood();
    }

    // Função para tratar eventos de teclado
    function handleKeyPress(event) {
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

    // Elementos de botões para mudar a direção da cobra
    const upButton = document.getElementById('upButton');
    const downButton = document.getElementById('downButton');
    const leftButton = document.getElementById('leftButton');
    const rightButton = document.getElementById('rightButton');
    const restart = document.getElementById('restart')
    

    // Adiciona listeners de clique para os botões
    upButton.addEventListener('click', () => changeDirection('up'));
    downButton.addEventListener('click', () => changeDirection('down'));
    leftButton.addEventListener('click', () => changeDirection('left'));
    rightButton.addEventListener('click', () => changeDirection('right'));
    restart.addEventListener('click', ()=> resetGame())
    
    // Função para mudar a direção da cobra
    function changeDirection(newDirection) {
        if (
            (direction === 'up' && newDirection !== 'down') ||
            (direction === 'down' && newDirection !== 'up') ||
            (direction === 'left' && newDirection !== 'right') ||
            (direction === 'right' && newDirection !== 'left')
        ) {
            direction = newDirection;
        }
    }

    // Função para atualizar a lista de top scores na interface
    function updateTopScores() {
        topScoresContainer.innerHTML = '';

        topScores.forEach((player, index) => {
            const paragraph = document.createElement('p');
            paragraph.innerText = `${index + 1}. ${player.name}: ${player.score} pts`;
            topScoresContainer.appendChild(paragraph);
        });
    }

    // Inicializa o jogo chamando as funções necessárias
    createBoard();
    drawSnake();
    generateFood();
    drawFood();
    scoreElement.innerText = score;

    // Configura o intervalo para atualizar o jogo
    setInterval(updateGame, snakeSpeed);

    // Adiciona listener de teclado para mudar a direção da cobra
    document.addEventListener('keydown', handleKeyPress);
});
