// Create grid fragment function
const createBoardFragment = (rows, cols, attributes) => {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < rows * cols; i++) {
        const tile = document.createElement('button');
        tile.dataset.index = i;
        tile.className = attributes.className;
        fragment.appendChild(tile);
    }
    return fragment;
};

const totalRows = 4;
const totalCols = 4;
const positions = Array.from({ length: totalRows * totalCols }, (_, i) => i);
const flipDelay = 2000;
const icons = [
    '🍇', '🍉', '🚗', '🍌', '🏠', '🥭', '🍎', '🐯', '🍒', '🍓', '🐵', '🥝',
    '🍿', '🏀', '🎱', '🐻', '🍜', '🍢', '🎓', '🍤', '🦀', '🍦', '🍩', '🎂',
    '🍫', '🍭', '🍼', '🪔', '🍺', '🐱', '🐶'
];

let flippedTiles = [];
let triesCount = 0;
let shuffledIcons = [];
let isRestarting = false;
let timeoutId;
const frontGrid = document.querySelector('.grid-front');
const backGrid = document.querySelector('.grid-back');
const outputTries = document.querySelector('output');
const restartBtn = document.querySelector('.btn-restart');

const shuffleIcons = (rows, cols, items) => {
    const chosenIcons = Array.from({ length: (rows * cols) / 2 }, () => items[Math.floor(Math.random() * items.length)]);
    const allIcons = chosenIcons.concat(chosenIcons);

    for (let i = allIcons.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allIcons[i], allIcons[j]] = [allIcons[j], allIcons[i]];
    }

    return allIcons;
};

const addClassToElements = (elements, className) => {
    elements.forEach(pos => {
        frontGrid.children[pos].classList.add(className);
        backGrid.children[pos].classList.add(className);
    });
};

const removeClassFromElements = (elements, className) => {
    elements.forEach(pos => {
        frontGrid.children[pos].classList.remove(className);
        backGrid.children[pos].classList.remove(className);
    });
};

const startGame = async (initial = false) => {
    if (isRestarting) {
        return;
    }

    shuffledIcons = [];
    flippedTiles = [];
    triesCount = 0;
    isRestarting = true;
    outputTries.textContent = triesCount;

    if (!initial) {
        frontGrid.classList.add('restarting');
        backGrid.classList.add('restarting');

        removeClassFromElements(positions, 'flipped');
        removeClassFromElements(positions, 'matched');

        await new Promise(r => setTimeout(r, flipDelay / 2));
    }

    shuffledIcons = shuffleIcons(totalRows, totalCols, icons);
    backGrid.childNodes.forEach((el, idx) => {
        el.textContent = shuffledIcons[idx];
    });

    frontGrid.classList.remove('restarting');
    backGrid.classList.remove('restarting');
    isRestarting = false;
};

frontGrid.appendChild(createBoardFragment(totalRows, totalCols, { className: 'card' }));
backGrid.appendChild(createBoardFragment(totalRows, totalCols, { className: 'card back-card' }));

frontGrid.addEventListener('click', e => {
    const index = e.target.dataset.index;

    if (index == null || isRestarting || e.target.classList.contains('matched')) {
        return;
    }

    triesCount++;

    if (flippedTiles.length === 2) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        removeClassFromElements(flippedTiles, 'flipped');
        flippedTiles = [];
    }

    flippedTiles.push(index);

    if (flippedTiles.length === 2) {
        if (shuffledIcons[flippedTiles[0]] === shuffledIcons[flippedTiles[1]]) {
            removeClassFromElements(flippedTiles, 'flipped');
            addClassToElements(flippedTiles, 'matched');
        }

        timeoutId = setTimeout(() => {
            removeClassFromElements(flippedTiles, 'flipped');
            flippedTiles = [];
        }, flipDelay);
    }

    e.target.classList.add('flipped');
    backGrid.children[index].classList.add('flipped');
    outputTries.textContent = triesCount;
});

restartBtn.addEventListener('click', () => startGame());
startGame(true);
