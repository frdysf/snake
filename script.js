// PENDING BUG: sometimes snake disappears, need to solve - classList of undefined being accessed?
// often traced to eraseSnake, drawBlock, etc.

const state = {
    numCells: (600/40) * (600/40), // total number of grid cells: (#grid height / --cell-size) * (#grid width / --cell-size)
    cells: [],

    snakePos: [],   // current cells occupied by snake
    snakeDir: '',  // current moving direction of snake
    foodPos: 0, // current position of food
    blockPos: [],  // current cells occupied by procedurally generated obstacles/blocks

    score: 0,
    gameOver: false
}

const initGame = (element) => {
    state.app = element;  // element should be the top-level container (div)

    drawStartButton();
    drawHeader();
    drawGrid();

    drawScore();

    const directions = ['left', 'right', 'up', 'down'];

    state.snakePos[0] = getRandomPos(); // initial position of snake head, snakePos[0]
    state.foodPos = getRandomPos();
    state.snakeDir = directions[Math.floor(Math.random() * directions.length)];

    drawSnake();
    drawFood(state.foodPos);

}

const drawStartButton = () => {
    const startButton = document.createElement('button');

    startButton.setAttribute('type', 'button');
    startButton.classList.add('button');
    startButton.setAttribute('id', 'start');

    const h1 = document.createElement('h1');
    h1.innerText = "Start";
    startButton.append(h1);

    return startButton;
}

const drawRetryButton = () => {
    const retryButton = document.createElement('button');

    retryButton.setAttribute('type', 'button');
    retryButton.classList.add('button');
    retryButton.setAttribute('id', 'retry');

    const h1 = document.createElement('h1');
    h1.innerText = "Retry";
    retryButton.append(h1);

    return retryButton;
}

const drawHeader = () => {
    const header = document.createElement('div');
    header.setAttribute('id', 'header')

    const h1 = document.createElement('h1');
    h1.innerText = "Snake";
    header.append(h1);

    state.app.appendChild(header);
}

const drawGrid = () => {
    const grid = document.createElement('div');
    grid.setAttribute('id', 'grid');

    for (let i = 0; i < state.numCells; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        grid.appendChild(cell);
        state.cells.push(cell);
    }

    state.app.appendChild(grid);

    startButton = drawStartButton();
    grid.appendChild(startButton);

    startButton.addEventListener('click', play)
}

const drawScore = () => {
    const score = document.createElement('div');
    score.setAttribute('id', 'score');
    state.app.appendChild(score);

    const h1 = document.createElement('h1');
    h1.innerText = `Score: ${state.score}`;
    score.append(h1);
}

const updateScore = () => {
    score = document.getElementById('score');
    score.innerHTML = ``;
    const h1 = document.createElement('h1');
    h1.innerText = `Score: ${++state.score}`;
    score.append(h1);
}

const drawSnake = () => {
    for (let i = 0; i < state.snakePos.length; i++) {
        state.cells[state.snakePos[i]].classList.add('snake');
    }
}

const eraseSnake = () => {
    for (let i = 0; i < state.snakePos.length; i++) {
        state.cells[state.snakePos[i]].classList.remove('snake');
    }
}

const drawFood = (position) => {
    state.foodPos = position;
    state.cells[state.foodPos].classList.add('food');
}

const eraseFood = () => {
    state.cells[state.foodPos].classList.remove('food');
}

const drawBlock = (position) => {
    state.blockPos.push(position);
    state.cells[position].classList.add('block');    
}

const moveSnake = (direction) => {
    switch (direction) {
        case 'left':
            if (state.snakePos[0] % Math.sqrt(state.numCells) === 0  // snake head hits wall in direction
                || state.snakePos.includes(state.snakePos[0] - 1)  // snake collides with itself in direction
                || state.blockPos.includes(state.snakePos[0] - 1)) {  // snake collides with block in direction
                    state.gameOver = true;
                    return;
            } else state.snakePos.unshift(state.snakePos[0] - 1);
            break;

        case 'right':
            if (state.snakePos[0] % Math.sqrt(state.numCells) === Math.sqrt(state.numCells) - 1  // "
                || state.snakePos.includes(state.snakePos[0] + 1)  // "
                ||  state.blockPos.includes(state.snakePos[0] + 1)) {  // "
                    state.gameOver = true;
                    return;
            } else state.snakePos.unshift(state.snakePos[0] + 1);
            break;

        case 'up':
            if (state.snakePos[0] <= Math.sqrt(state.numCells) - 1  // "
                || state.snakePos.includes(state.snakePos[0] - Math.sqrt(state.numCells))  // "
                || state.blockPos.includes(state.snakePos[0] - Math.sqrt(state.numCells))) {  // "
                    state.gameOver = true;
                    return;
            } else state.snakePos.unshift(state.snakePos[0] - Math.sqrt(state.numCells));
            break;

        case 'down':
            if (state.snakePos[0] >= state.numCells - Math.sqrt(state.numCells)  // "
                || state.snakePos.includes(state.snakePos[0] + Math.sqrt(state.numCells))  // "
                || state.blockPos.includes(state.snakePos[0] + Math.sqrt(state.numCells))) {  // "
                    state.gameOver = true;
                    return;
            } else state.snakePos.unshift(state.snakePos[0] + Math.sqrt(state.numCells));
            break;
    }

    eraseSnake();
    state.snakePos.pop();
    drawSnake();

    checkForFood();
}

const checkForFood = () => {
    if (state.snakePos[0] === state.foodPos) {
        eraseFood();
        updateScore();

        switch (state.snakeDir) {  // add unit length to snake, depending on snake's current direction and tail position
            case 'left':
                state.snakePos.push(state.snakePos.at(-1) + 1);
                break;
            case 'right':
                state.snakePos.push(state.snakePos.at(-1) - 1);
                break;
            case 'up':
                state.snakePos.push(state.snakePos.at(-1) + Math.sqrt(state.numCells));
                break;
            case 'down':
                state.snakePos.push(state.snakePos.at(-1) - Math.sqrt(state.numCells));
                break;
        }

        let pos1;
        do {pos1 = getRandomPos();} while (state.snakePos.includes(pos1) || state.blockPos.includes(pos1));  // no food appearing on snake or blocks
        drawFood(pos1);

        let pos2;
        do {pos2 = getRandomPos();} while (state.snakePos.includes(pos2) || pos2 === pos1);  // no blocks appearing on snake or food
        drawBlock(pos2);
    }
}

var getRandomPos = () => {  // return random position in grid
    return Math.floor(Math.random() * state.numCells) - 1;
}

const controlSnake = (event) => {  // event handler for key press
    if (state.gameOver) return;  // do nothing

    switch (event.code) {
        case 'ArrowLeft':
            if (state.snakeDir === 'right') return;  // do nothing if snake is moving in the exact opposite direction; player must turn manually
            else {
                moveSnake('left');
                state.snakeDir = 'left';
                break;
            }
        case 'ArrowRight':
            if (state.snakeDir === 'left') return;  // "
            else {
                moveSnake('right');
                state.snakeDir = 'right';
                break;
            }
        case 'ArrowUp':
            if (state.snakeDir === 'down') return;  // "
            else {
                moveSnake('up');
                state.snakeDir = 'up';
                break;
            }
        case 'ArrowDown':
            if (state.snakeDir === 'up') return;  // "
            else {
                moveSnake('down');
                state.snakeDir = 'down';
                break;
            }
    }
}

const play = () => {
    document.getElementById('start').style.visibility = 'hidden';

    let interval;
    interval = setInterval(() => {

    if (state.gameOver) {
        clearInterval(interval);
        drawMessage('You have met your end.');

        retryButton = drawRetryButton();
        grid = document.getElementById('grid');
        
        grid.removeChild(document.querySelector('#start'));
        grid.appendChild(retryButton);

        retryButton.addEventListener('click', reloadPage);
    } else moveSnake(state.snakeDir);

    }, 200);  // adjusts speed of snake (hence difficulty of game)

    window.addEventListener('keydown', controlSnake);

}

const reloadPage = () => {
    window.location.reload();
}

const drawMessage = (text) => {
    const message = document.createElement('div');
    message.classList.add('message');

    const h1 = document.createElement('h1');
    h1.innerText = text;
    message.append(h1);

    state.app.append(message);
}

// --- main script ----
const appElement = document.getElementById('app');
initGame(appElement);