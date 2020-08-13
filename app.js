document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const width = 10;
  const ScoreDisplay = document.querySelector("#score");
  console.log(ScoreDisplay);
  const StartPauseButton = document.querySelector("#start-pause-button");
  var squareArray = Array.from(document.querySelectorAll(".grid div"));
  var displayArray = Array.from(document.querySelectorAll(".mini-grid div"));

  const createTetrominoes = function (width) {
    let tetrominoes = [
      [
        [1, 2, width + 1, 2 * width + 1],
        [width, width + 1, width + 2, 2 * width + 2],
        [1, width + 1, 2 * width, 2 * width + 1],
        [width, 2 * width, 2 * width + 1, 2 * width + 2],
      ],
      [
        [width + 1, width + 2, 2 * width, 2 * width + 1],
        [0, width, width + 1, 2 * width + 1],
        [width + 1, width + 2, 2 * width, 2 * width + 1],
        [0, width, width + 1, 2 * width + 1],
      ],
      [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, 2 * width + 1],
        [width, width + 1, width + 2, 2 * width + 1],
        [1, width, width + 1, 2 * width + 1],
      ],
      [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
      ],
      [
        [1, width + 1, 2 * width + 1, 3 * width + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, 2 * width + 1, 3 * width + 1],
        [width, width + 1, width + 2, width + 3],
      ],
    ];
    return tetrominoes;
  };

  const theTetrominoes = createTetrominoes(width);
  const displayTetrominoes = createTetrominoes(4);

  const getRandomTetrominoIndex = function () {
    return Math.floor(Math.random() * theTetrominoes.length);
  };

  // app state variables
  let currentPosition = 4;
  let currentRotation = 0;
  let nextTetrominosIndex = getRandomTetrominoIndex();
  let currentTetromino;
  let currentTetroinoRotation;
  let displayTetroinoRotation;
  let timerId;
  let score = 0;
  let level = 0;

  const getPoints = function (linesCleared, level) {
    switch (linesCleared) {
      case 0:
        return 0;
      case 1:
        return 40 * (level + 1);
      case 2:
        return 100 * (level + 1);
      case 3:
        return 300 * (level + 1);
      case 4:
        return 1200 * (level + 1);
      default:
        return 1200 * (level + 1);
    }
  };

  const UpdateScoreDisplay = function (linesCleared) {
    var points = getPoints(linesCleared, level);
    score += points;
    ScoreDisplay.textContent = score;
  };

  const updateTetromino = function () {
    currentTetromino = theTetrominoes[nextTetrominosIndex];
    currentTetroinoRotation = currentTetromino[currentRotation];
    nextTetrominosIndex = getRandomTetrominoIndex();
    displayTetroinoRotation = displayTetrominoes[nextTetrominosIndex][0];
  };

  const drawCurrentRotation = function () {
    clearCurrentRotation();
    ScoreDisplay;
    currentTetroinoRotation.forEach((index) => {
      squareArray[currentPosition + index].classList.add("tetromino");
    });
  };

  const drawDisplayRotation = function () {
    clearDisplayRotation();
    displayTetroinoRotation.forEach((index) => {
      displayArray[index].classList.add("tetromino");
    });
  };

  const clearCurrentRotation = function () {
    currentTetroinoRotation.forEach((index) => {
      squareArray[currentPosition + index].classList.remove("tetromino");
    });
  };

  const clearDisplayRotation = function () {
    displayTetroinoRotation.forEach((index) => {
      displayArray[index].classList.remove("tetromino");
    });
  };

  const isTaken = function (index) {
    return squareArray[currentPosition + index].classList.contains("taken");
  };

  const setTaken = function (index) {
    return squareArray[currentPosition + index].classList.add("taken");
  };

  const isLeft = function (index) {
    return (currentPosition + index) % width === 0;
  };

  const isRight = function (index) {
    return (currentPosition + index) % width === 9;
  };

  const moveLeft = function () {
    clearCurrentRotation();
    const isLeftEdge = currentTetroinoRotation.some((index) => isLeft(index));
    if (!isLeftEdge) {
      currentPosition--;
    }

    if (currentTetroinoRotation.some((index) => isTaken(index))) {
      currentPosition++;
    }
    drawCurrentRotation();
  };

  const moveRight = function () {
    clearCurrentRotation();
    const isRightEdge = currentTetroinoRotation.some((index) => isRight(index));
    if (!isRightEdge) {
      currentPosition++;
    }

    if (currentTetroinoRotation.some((index) => isTaken(index))) {
      currentPosition--;
    }
    drawCurrentRotation();
  };

  const removeRow = function (rowIndex) {
    let removedRow = squareArray.splice(width * rowIndex, width);
    removedRow.forEach((x) => x.classList.remove("taken", "tetromino"));
    squareArray = removedRow.concat(squareArray);
    squareArray.forEach((item) => grid.appendChild(item));
  };

  const checkRemoveRows = function () {
    let rowIndexes = [...Array(20).keys()];
    let linesCleared = 0;
    console.log(rowIndexes);
    rowIndexes.forEach((rowIndex) => {
      let row = squareArray.slice(width * rowIndex, width * (rowIndex + 1));
      if (row.every((divItem) => divItem.classList.contains("taken"))) {
        removeRow(rowIndex);
        linesCleared++;
      }
    });
    UpdateScoreDisplay(linesCleared, level)
  };

  const moveDown = function () {
    clearCurrentRotation();
    currentPosition += width;

    if (currentTetroinoRotation.some((index) => isTaken(index))) {
      currentPosition -= width;
      drawCurrentRotation();
      currentTetroinoRotation.forEach((index) => setTaken(index));
      clearDisplayRotation();
      updateTetromino();
      drawDisplayRotation();
      setStartPosition();
      checkRemoveRows();
    }
    drawCurrentRotation();
  };

  const canRotateTetromino = function () {
    let collision = currentTetroinoRotation.some((index) => isTaken(index));
    let isLeftEdge = currentTetroinoRotation.some((index) => isLeft(index));
    let isRightEdge = currentTetroinoRotation.some((index) => isRight(index));
    return !(collision || (isLeftEdge && isRightEdge));
  };

  const rotateTetromino = function () {
    clearCurrentRotation();
    currentRotation = (currentRotation + 1) % currentTetroinoRotation.length;
    currentTetroinoRotation = currentTetromino[currentRotation];
    if (!canRotateTetromino()) {
      currentRotation =
        (currentRotation + currentTetroinoRotation.length - 1) %
        currentTetroinoRotation.length;
      currentTetroinoRotation = currentTetromino[currentRotation];
    }
    drawCurrentRotation();
  };

  const setStartPosition = function () {
    currentPosition = 4;
  };

  const keyboardKeyHandler = function (e) {
    e = e || window.event;
    if (e.keyCode == "38") {
      rotateTetromino();
    } else if (e.keyCode == "40") {
      moveDown();
    } else if (e.keyCode == "37") {
      moveLeft();
    } else if (e.keyCode == "39") {
      moveRight();
    }
  };

  const startPauseButtonHandler = function () {
    if (timerId) {
      document.removeEventListener("keydown", keyboardKeyHandler);
      clearInterval(timerId);
      timerId = null;
    } else {
      timerId = setInterval(moveDown, 1000);
      document.addEventListener("keydown", keyboardKeyHandler);
    }
  };

  StartPauseButton.addEventListener("click", function () {
    startPauseButtonHandler();
  });

  updateTetromino();
  drawCurrentRotation();
  drawDisplayRotation();
});

function showHiAlert(firstName, lastName) {
  alert(`Hi ${firstName} ${lastName || ""}!`);
}
