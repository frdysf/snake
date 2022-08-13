// INTRODUCED snakeDir, need to go back to foundation and confirm automatic moving snake head
// move snake with length > 1 by unshifting based on snakeDir, and pop tail of snake (state.snakePos.at(-1))
// three functions? moveSnake (auto movement controlled by interval), controlSnake (key event, response to key event + consider current movement)

const state = {
    numCells: (600/40) * (600/40), // total number of grid cells: (#grid height / --cell-size) * (#grid width / --cell-size)
    cells: [],

    snakePos: [110], // initial position of snake head, snakePos[0]
    snakeDir: 'left',  // current moving direction of snake
    foodPos: 107, // initial position of food

    score: 0,
    gameOver: false
}

const initGame = (element) => {
    state.app = element;  // element should be the top-level container (div)

    drawHeader();
    drawGrid();
    drawScoreboard();
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

const drawScoreboard = () => {
    const score = document.createElement('div');
    score.setAttribute('id', 'score')

    const h1 = document.createElement('h1');
    h1.innerText = `Score: ${state.score}`;
    score.append(h1);

    state.app.appendChild(score);

}

const drawSnake = () => {
    for (let i = 0; i < state.snakePos.length; i++) {
        state.cells[state.snakePos[i]].classList.add('snake');
    }

    // probably more to add here as the snake gets longer, turns, etc.
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
            if (state.snakePos[0] % Math.sqrt(state.numCells) === 0) {  // snake head hits wall in direction
                state.gameOver = true;
                return;
            } else state.snakePos.unshift(state.snakePos[0] - 1);
            break;

        case 'right':
            if (state.snakePos[0] % Math.sqrt(state.numCells) === Math.sqrt(state.numCells) - 1) {  // "
                state.gameOver = true;
                return;
            } else state.snakePos.unshift(state.snakePos[0] + 1);
            break;

        case 'up':
            if (state.snakePos[0] <=  Math.sqrt(state.numCells) - 1) {  // "
                state.gameOver = true;
                return;
            } else state.snakePos.unshift(state.snakePos[0] - Math.sqrt(state.numCells));
            break;

        case 'down':
            if (state.snakePos[0] >= state.numCells - Math.sqrt(state.numCells)) {  // "
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
        state.score++;
        // TO-DO: need to update scoreboard!!!

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

        pos = Math.floor(Math.random() * state.numCells) - 1;
        drawFood(pos);
    }
}

const controlSnake = (event) => {
    if (state.gameOver) return;  // do nothing

    switch (event.code) {
        case 'ArrowLeft':
            moveSnake('left');
            state.snakeDir = 'left';
            break;
        case 'ArrowRight':
            moveSnake('right');
            state.snakeDir = 'right';
            break;
        case 'ArrowUp':
            moveSnake('up');
            state.snakeDir = 'up';
            break;
        case 'ArrowDown':
            moveSnake('down');
            state.snakeDir = 'down';
            break;
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