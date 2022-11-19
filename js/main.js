const boardWidth = 500;
let boardSize = 4;
let start = [];
let moveCount = 0;

const dificultySelector = document.getElementById("dif");
if (document.cookie.includes("dificulty")) {
	dificultySelector.value = document.cookie.charAt(document.cookie.indexOf("dificulty") + 10);
}
const startBtn = document.getElementById("startBtn");
const board = document.getElementById("board");
startBtn.onclick = startFunc;

window.onload = (event) => {
	startFunc();
};

function startFunc() {
	moveCount = 0;
	boardSize = dificultySelector.value;
	let d = new Date();
	d.setDate(d.getDate() + (365 * 60 * 60 * 24 * 1000));
	document.cookie = "dificulty=" + boardSize + ";expires=" + d.toUTCString();
	createStart();
	const frag = new DocumentFragment();
	for (let i = 0; i < boardSize; i++) {
		for (let j = 0; j < boardSize; j++) {
			let tile = document.createElement("div");
			tile.style.width = `${boardWidth / boardSize - 4}px`;
			tile.style.height = `${boardWidth / boardSize - 4}px`;
			tile.style.lineHeight = `${boardWidth / boardSize - 4}px`;
			tile.innerHTML = start.shift();
			tile.className = "tile";
			tile.id = `${i}-${j}`;

			if (tile.innerHTML === "0") {
				empty = tile;
				tile.innerHTML = "";
				tile.className = "empty";
			}
			tile.onclick = press;
			frag.appendChild(tile);
		}
	}
	let winSign = document.createElement("div");
	winSign.style.display = "none";
	winSign.id = "win";
	frag.appendChild(winSign);
	board.replaceChildren(frag);
}

function createStart() {
	let pos = [];
	let end;
	do {
		start = [];
		for (let i = 0; i < boardSize * boardSize; i++) {
			pos.push(i);
		}
		for (let i = 0; i < boardSize * boardSize; i++) {
			start.push(pos.splice(parseInt(Math.random() * pos.length), 1)[0]);
		}
		end = isSolvable();
	} while (!end);
}

function press() {
	if (isAdjacent(this)) {
		empty.innerHTML = this.innerHTML;
		this.innerHTML = "";
		this.className = "empty";
		empty.className = "tile";
		empty = this;
		moveCount++;
		if (checkWin()) {
			for (let tile of document.getElementsByClassName("tile")) {
				tile.onclick = null;
				document.getElementById(
					"win"
				).innerHTML = `¡Felicidades! <br/> <div>${moveCount} movimientos</div>`;
				document.getElementById("win").style.display = "block";
			}
		}
	} else if (this.className !== "empty") {
		this.classList.add("nop");
		setTimeout(() => {
			this.classList.remove("nop");
		}, 1000);
	}
}

function checkWin() {
	let x, y, num;
	for (let tile of document.getElementsByClassName("tile")) {
		x = parseInt(tile.id.split("-")[0]);
		y = parseInt(tile.id.split("-")[1]);
		num = parseInt(tile.innerHTML);
		if (x * boardSize + y + 1 !== num) {
			return false;
		}
	}
	return true;
}

function isAdjacent(tile) {
	const eX = parseInt(empty.id.split("-")[0]),
		eY = parseInt(empty.id.split("-")[1]),
		tX = parseInt(tile.id.split("-")[0]),
		tY = parseInt(tile.id.split("-")[1]);
	return (
		(eX === tX + 1 && eY === tY) ||
		(eX === tX - 1 && eY === tY) ||
		(eY === tY + 1 && eX === tX) ||
		(eY === tY - 1 && eX === tX)
	);
}

// A NxN sliding puzzle starting position is solvable if
// N is odd and the number of inversions is even or if
// N is even and the empty space is located at an even number
// of rows from the bottom and the inversion cout is odd or if
// N is even and the empty space is located at an odd number
// of rows form the bottom and the invesion count is even
function isSolvable() {
	const inversionsCount = getInvCount();
	// odd grid
	if (boardSize % 2 !== 0) {
		return inversionsCount % 2 === 0;
	}
	// even grid
	if (
		(boardSize - parseInt(start.findIndex((x) => x === 0) / boardSize)) %
			2 === 0) {
		return inversionsCount % 2 !== 0;
	}
	return inversionsCount % 2 === 0;
}

// an inversion is when a is before b but a > b
// the empty space is not counted
function getInvCount() {
	let count = 0;
	for (let i = 0; i < boardSize * boardSize; i++) {
		for (let j = i + 1; j < boardSize * boardSize; j++) {
			if (start[i] !== 0 && start[j] !== 0 && start[i] > start[j]) {
				count++;
			}
		}
	}
	return count;
}
