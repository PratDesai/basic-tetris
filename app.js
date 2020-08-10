document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const width = 10;
  const ScoreDisplay = document.querySelector("#score");
  const StartPauseButton = document.querySelector("#start-pause-button");
  var squares = document.querySelectorAll(".grid div");
  var squareArray = Array.from(document.querySelectorAll(".grid div"));

  // the arrayItem
  const lTetromino = [
    [1, 2, width + 1, 2 * width + 1],
    [width, width + 1, width + 2, 2 * width + 2],
    [1, width + 1, 2 * width, 2 * width + 1],
    [width, 2 * width, 2 * width + 1, 2 * width + 2],
  ];
  const zTetromino = [
    [width + 1, width + 2, 2 * width, 2 * width + 1],
    [0, width, width + 1, 2 * width + 1],
    [width + 1, width + 2, 2 * width, 2 * width + 1],
    [0, width, width + 1, 2 * width + 1],
  ];
  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, 2 * width + 1],
    [width, width + 1, width + 2, 2 * width + 1],
    [1, width, width + 1, 2 * width + 1],
  ];
  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ];
  const iTetromino = [
    [1, width + 1, 2 * width + 1, 3 * width + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, 2 * width + 1, 3 * width + 1],
    [width, width + 1, width + 2, width + 3],
  ];

  const theTetrominoes = [
    lTetromino,
    zTetromino,
    tTetromino,
    oTetromino,
    iTetromino,
  ];

  const getRandomItem = function (arrayItem) {
    let randomIndex = Math.floor(Math.random() * arrayItem.length);
    return arrayItem[randomIndex];
  };

  // app state variables
  let currentPosition = 4;
  let currentRotation = 0;
  let currentTetromino = getRandomItem(theTetrominoes);
  let currentTetroinoRotation = currentTetromino[currentRotation];
  let timerId;

  const drawCurrentRotation = function () {
    clearCurrentRotation();
    currentTetroinoRotation.forEach((index) => {
      squareArray[currentPosition + index].classList.add("tetromino");
    });
  };

  const clearCurrentRotation = function () {
    currentTetroinoRotation.forEach((index) => {
      squareArray[currentPosition + index].classList.remove("tetromino");
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

  let spliceTestData = ["Mars", "Saturn", "Earth", "Pluto"];
  const testSplice = function () {
    console.log(spliceTestData);
    let removedItem = spliceTestData.splice(3, 1);
    console.log(removedItem);
    console.log(spliceTestData);
    spliceTestData = removedItem.concat(spliceTestData);
    console.log(spliceTestData);
  };

  const removeRow = function(rowIndex){
    let removedRow = squareArray.splice(width * rowIndex, width)
    removedRow.forEach(x => x.classList.remove('taken', 'tetromino'))
    console.log(removedRow);
    console.log(squareArray);
    squareArray = removedRow.concat(squareArray);
    squareArray.forEach(item => grid.appendChild(item))
    console.log(squareArray);
  }
  
  const checkRemoveRows = function () {
    let rowIndexes = [...Array(20).keys()]
    console.log(rowIndexes);
    rowIndexes.forEach(rowIndex => {
      let row = squareArray.slice(width * rowIndex, width * (rowIndex + 1));
      if(row.every(divItem => divItem.classList.contains('taken'))){
        removeRow(rowIndex)
      }
    })
    // let lastRow = squareArray.slice(width * 19, width * 20);
    // if(lastRow.every(x => x.classList.contains('taken'))){
    //   let removedRow = squareArray.splice(width * 19, width)
    // }
  };

  const moveDown = function () {
    clearCurrentRotation();
    currentPosition += width;

    if (currentTetroinoRotation.some((index) => isTaken(index))) {
      currentPosition -= width;
      drawCurrentRotation();
      currentTetroinoRotation.forEach((index) => setTaken(index));
      currentTetromino = getRandomItem(theTetrominoes);
      currentTetroinoRotation = currentTetromino[currentRotation];
      setStartPosition();
      checkRemoveRows();
    }
    drawCurrentRotation();
  };

  const rotateTetromino = function () {
    clearCurrentRotation();
    currentRotation = (currentRotation + 1) % currentTetroinoRotation.length;
    currentTetroinoRotation = currentTetromino[currentRotation];
    const cannotRotate = currentTetroinoRotation.some((index) =>
      isTaken(index)
    );
    const isLeftEdge = currentTetroinoRotation.some((index) => isLeft(index));
    const isRightEdge = currentTetroinoRotation.some((index) => isRight(index));
    if (cannotRotate || (isLeftEdge && isRightEdge)) {
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
      document.removeEventListener('keydown', keyboardKeyHandler);
      clearInterval(timerId);
      timerId = null;
    } else {
      timerId = setInterval(moveDown, 1000);
      document.addEventListener('keydown', keyboardKeyHandler);
    }
  };

  console.log(StartPauseButton);
  StartPauseButton.addEventListener("click", function () {
    startPauseButtonHandler();
  });

  drawCurrentRotation();
});

function showHiAlert(firstName, lastName) {
  alert(`Hi ${firstName} ${lastName || ""}!`);
}
