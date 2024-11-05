function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const draggedElement = document.getElementById(data);

    if (event.target.childNodes.length === 0) {
        event.target.appendChild(draggedElement);
        draggedElement.style.backgroundColor = '#3498db';
    }
}

function generateBoard(size) {
    const board = document.getElementById(`board${size}x${size}`);
    board.innerHTML = '';

    for (let i = 0; i < size * size; i++) {
        const cell = document.createElement('div');
        cell.ondrop = drop;
        cell.ondragover = allowDrop;
        cell.classList.add("cell");
        board.appendChild(cell);
    }
}

function generateNumbers(size) {
    const numbersContainer = document.getElementById(`numbers${size}x${size}`);
    numbersContainer.innerHTML = '';

    for (let i = 1; i <= size * size; i++) {
        const numberDiv = document.createElement('div');
        numberDiv.textContent = i;
        numberDiv.classList.add('number');
        numberDiv.draggable = true;
        numberDiv.id = `num${size}x${i}`;
        numberDiv.ondragstart = drag;
        numbersContainer.appendChild(numberDiv);
    }
}

function checkSquare(size) {
    const cells = Array.from(document.querySelectorAll(`#board${size}x${size} .cell`));
    const numbers = cells.map(cell => cell.textContent ? parseInt(cell.textContent, 10) : 0);
    const targetSum = size === 3 ? 15 : size === 4 ? 34 : 65;
    let isMagic = true;

    function updateCellColors(indices, correct) {
        indices.forEach(index => {
            cells[index].style.backgroundColor = correct ? 'green' : 'red';
        });
    }

    for (let i = 0; i < size; i++) {
        const rowIndices = Array.from({ length: size }, (_, k) => i * size + k);
        const rowSum = rowIndices.reduce((sum, index) => sum + numbers[index], 0);
        updateCellColors(rowIndices, rowSum === targetSum);
        if (rowSum !== targetSum) isMagic = false;
    }

    for (let i = 0; i < size; i++) {
        const colIndices = Array.from({ length: size }, (_, k) => k * size + i);
        const colSum = colIndices.reduce((sum, index) => sum + numbers[index], 0);
        updateCellColors(colIndices, colSum === targetSum);
        if (colSum !== targetSum) isMagic = false;
    }

    const diag1Indices = Array.from({ length: size }, (_, i) => i * (size + 1));
    const diag1Sum = diag1Indices.reduce((sum, index) => sum + numbers[index], 0);
    updateCellColors(diag1Indices, diag1Sum === targetSum);
    if (diag1Sum !== targetSum) isMagic = false;

    const diag2Indices = Array.from({ length: size }, (_, i) => (i + 1) * (size - 1));
    const diag2Sum = diag2Indices.reduce((sum, index) => sum + numbers[index], 0);
    updateCellColors(diag2Indices, diag2Sum === targetSum);
    if (diag2Sum !== targetSum) isMagic = false;

    showPopup(
        isMagic
            ? `🎉 ¡Felicidades! Has completado correctamente el cuadro ${size}x${size}.`
            : `❌ El cuadro ${size}x${size} no es correcto. ¡Intenta de nuevo!`
    );
}

function showPopup(message) {
    const popup = document.createElement('div');
    popup.classList.add('popup');

    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    popup.appendChild(messageElement);

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Cerrar';
    closeButton.onclick = () => document.body.removeChild(popup);
    popup.appendChild(closeButton);

    document.body.appendChild(popup);
}

function resetGame(size) {
    generateBoard(size);
    generateNumbers(size);
}

window.onload = () => {
    [3, 4, 5].forEach(size => {
        generateBoard(size);
        generateNumbers(size);
    });
};
