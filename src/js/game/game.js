import {
    COLORS,
    Square
} from '/src/js/models/square.js';

const DELAY = 500;

let _currentPattern = [];
let _playerPattern = [];
let _isPlayerInputEnabled = true;
let _startingPatternLength = 3;
let _highestScore = _playerPattern.length;


export const playGame = () => {
    _disableInput();

    _playCurrentPatternSequence();

    _enableInput();
}

export const createGame = () => {
    _currentPattern = [];
    _playerPattern = [];

    _initializeScores();
    _buildPattern(_currentPattern);
    _buildBoard(COLORS);
}

export const activateSquareElement = (squareElement) => {
    let color = squareElement.getAttribute('color');

    _activateSquareByColor(color);

    _playerPattern.push(color);

    _checkPatternMatch(_currentPattern, _playerPattern);
}

const _initializeScores = () => {
    _updateHighestScore(_highestScore);
    _updateCurrentScore(_playerPattern.length);
}

const _buildPattern = (pattern) => {
    for (let i = 0; i < _startingPatternLength; i++) {
        let color = _randomColor();

        pattern.push(color);
    }
}

const _buildBoard = (colors) => colors.forEach(color => {
    const columnElement = document.createElement('div');
    const anchorElement = document.createElement('a');
    const squareElement = document.createElement('div');
    const audioElement = document.createElement('audio');
    const audioSourceElement = document.createElement('source');

    columnElement.setAttribute('id', `column-${color}`);
    columnElement.setAttribute('class', 'column');

    anchorElement.setAttribute('id', `square-${color}-anchor`);
    anchorElement.setAttribute('onclick', 'activateSquareElement(this)');
    anchorElement.setAttribute('color', `${color}`);

    squareElement.setAttribute('id', `square-${color}`);
    squareElement.setAttribute('class', `box is-large is-${color}`);

    audioElement.setAttribute('id', `square-${color}-audio`);

    audioSourceElement.setAttribute('src', `src/audio/colors/${color}.mp3`);
    audioSourceElement.setAttribute('type', 'audio/mpeg');

    squareElement.addEventListener('click', _activateSquare);

    document.getElementById('squares').appendChild(columnElement);
    columnElement.appendChild(anchorElement);
    anchorElement.appendChild(squareElement);
    squareElement.appendChild(audioElement);
    audioElement.appendChild(audioSourceElement);
});


const _updateHighestScore = (newHighScore) => {
    _highestScore = newHighScore;

    let highScoreElement = document.getElementById('high-score');

    highScoreElement.innerHTML = _highestScore;
}

const _updateCurrentScore = (currentScore) => {
    let currentScoreElement = document.getElementById('current-score');

    currentScoreElement.innerHTML = currentScore;
}

const _checkPatternMatch = (gamePattern, playerPattern) => {
    if (gamePattern.length === playerPattern.length) {
        if (gamePattern !== playerPattern) {
            if (playerPattern.length > _highestScore) {
                alert(`New High Score!\n${_highestScore}`);

                _updateHighestScore(playerPattern.length);
            } else {
                alert(`Great Job!\n${playerPattern.length}`);
            }
        } else {
            _updateCurrentScore(_playerPattern.length);

            gamePattern.push(_randomColor());

            playGame();
        }
    }
}

const _playCurrentPatternSequence = () => {
    _currentPattern.forEach(color => {
        console.log('square', color);

        setTimeout(_activateSquare(color), DELAY);
    });
}

const _activateSquareByColor = (color) => {
    _activateSquare(color);

    _playAudio(color);

    _deactivateSquare(color);
}

const _toggleSquareActive = (color, isActive) => {
    console.log('color', color);
    console.log('isActive', isActive);

    let squareElement = document.getElementById(`square-${color}`);

    let classValue = `box is-${color}`;

    if (isActive) {
        classValue += '-active';
    }

    squareElement.setAttribute('class', classValue);
}

const _activateSquare = (color) => _toggleSquareActive(color, true);

const _deactivateSquare = (color) => _toggleSquareActive(color, false);

const _playAudio = (color) => {
    let audioElement = document.getElementById(`square-${color}-audio`);

    audioElement.play();
}

const _randomColorSquare = () => Square(_randomColor());

const _randomColor = () => COLORS[_randomInt(COLORS.length)];

const _randomInt = (max) => Math.floor(Math.random() * Math.floor(max));

const _toggleInput = (isEnabled) => _isPlayerInputEnabled = isEnabled;

const _enableInput = () => _toggleInput(true);

const _disableInput = () => _toggleInput(false);