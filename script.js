// sometimes snake disappears, need to solve - classList of undefined being accessed?
// need to fix bug above
// need to stop snake from overlapping itself
// need to make sure foodPos cannot appear on snake
// add an obstacle (black cell, i.e. wall) in grid each time snake consumes food

const state = {
    numCells: (600/40) * (600/40), // total number of grid cells: (#grid height / --cell-size) * (#grid width / --cell-size)
    cells: [],

    snakePos: [],   // current positions of cells occupied by snake
    snakeDir: '',  // current moving direction of snake
    foodPos: 0, // initial position of food

    score: 0,
    gameOver: false
}

const initGame = (element) => {
    state.app = element;  // element should be the top-level container (div)

    drawHeader();
    drawGrid();

    score = initScore();
    drawScore(score);

    const directions = ['left', 'right', 'up', 'down'];

    state.snakePos.push(getRandomPos()); // initial position of snake head, snakePos[0]
    state.foodPos = getRandomPos();
    state.snakeDir = directions[Math.floor(Math.random() * directions.length)];
    console.log(state.snakeDir);

    drawSnake();
    drawFood(state.foodPos);

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
}

var initScore = () => {
    const score = document.createElement('div');
    score.setAttribute('id', 'score');
    return state.app.appendChild(score);
}

const drawScore = (score) => {
    const h1 = document.createElement('h1');
    h1.innerText = `Score: ${state.score}`;
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

const moveSnake = (direction) => {
    switch (direction) {
        case 'left':
            if (state.snakePos[0] % Math.sqrt(state.numCells) === 0  // snake head hits wall in direction
                || state.snakePos.includes(state.snakePos[0] - 1)) {  // snake collides with itself in direction
                    state.gameOver = true;
                    return;
            } else state.snakePos.unshift(state.snakePos[0] - 1);
            break;

        case 'right':
            if (state.snakePos[0] % Math.sqrt(state.numCells) === Math.sqrt(state.numCells) - 1 // "
                || state.snakePos.includes(state.snakePos[0] + 1)) {  // "
                    state.gameOver = true;
                    return;
            } else state.snakePos.unshift(state.snakePos[0] + 1);
            break;

        case 'up':
            if (state.snakePos[0] <= Math.sqrt(state.numCells) - 1 // "
                || state.snakePos.includes(state.snakePos[0] - Math.sqrt(state.numCells))) {  // "
                    state.gameOver = true;
                    return;
            } else state.snakePos.unshift(state.snakePos[0] - Math.sqrt(state.numCells));
            break;

        case 'down':
            if (state.snakePos[0] >= state.numCells - Math.sqrt(state.numCells) // "
                || state.snakePos.includes(state.snakePos[0] + Math.sqrt(state.numCells))) {  // "
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
        state.cells[state.foodPos].classList.remove('food');
        updateScore();

        switch (state.snakeDir) {
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

        let pos;
        do {pos = getRandomPos();} while (state.snakePos.includes(pos));  // food won't appear on cells currently occupied by snake
        drawFood(pos);
    }
}

var getRandomPos = () => {  // return random position (cell) in grid
    return Math.floor(Math.random() * state.numCells) - 1;
}

const updateScore = () => {
    score = document.querySelector('#score');
    score.innerHTML = ``;
    state.score++;
    drawScore(score);
    // ...
}

const controlSnake = (event) => {
    if (state.gameOver) return;  // do nothing

    switch (event.code) {
        case 'ArrowLeft':
            if (state.snakeDir === 'right') return;  // do nothing if snake is moving in the exact opposite direction; player must turn
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

    let interval;

    interval = setInterval(() => {

    if (state.gameOver) {
        clearInterval(interval);
        drawMessage('You have met your end.');
    } else moveSnake(state.snakeDir);

    }, 200);

    window.addEventListener('keydown', controlSnake);

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
play();