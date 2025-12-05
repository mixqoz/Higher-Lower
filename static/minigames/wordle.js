const height = 6; // Number of guesses
const width = 5;  // Length of the word

let row = 0; // Current guess (attempt number)
let col = 0; // Current letter for the attempt

let gameOver = false;

var words = "SQUID"

window.onload = function() {
	initialize();
}

function initialize() {
	// Creates the board
	for (let r = 0; r < height; r++) {
		for (let c = 0; c < width; c++) {
			// Create tile: <span id="0-0" class="tile"> </span>
			let tile = document.createElement("span");
			tile.id = r.toString() + "-" + c.toString();
			tile.classList.add("tile");
			tile.innerText = "";
			document.getElementById("board").appendChild(tile);
		}
	}
	// Searches for key presses
	document.addEventListener("keyup", (e) => {
		if (gameOver) return;

		// Tests if key is pressed:
		// alert(e.code);

		// Compares the dictionary order and only allows the keys A - A to be inputted
		if (e.key.length === 1 && /[a-z]/i.test(e.key)) {
			// Makes it so that you can only eneter if you have reached collumn five (entered a five letter word)
			if (col < width) {
				let currTile = document.getElementById(row.toString() + "-" + col.toString());
				if (currTile.innerText == "") {
					// Returns the letters pressed
					currTile.innerText = e.key.toUpperCase();
					col += 1;
				}
			}
		}

		// Makes users able to delete letters with backspace but can't delete letters beyond the first coloumn (0)
		else if (e.code == "Backspace") {
			if (0 < col && col <= width) {
				col -= 1;
			}
			let currTile = document.getElementById(row.toString() + "-" + col.toString());
			currTile.innerText = "";
		}

		else if (e.code == "Enter") {
			update();
			row += 1; // Move to the next row
			col = 0; // Reset column to 0

		}

		// Used up all attemps
		if (!gameOver && row == height) {
			gameOver = true;
			document.getElementById("answer").innerText = "The word was: " + words;
		}
	})
}

function update() {
    let correct = 0;
    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(row.toString() + '-' + c.toString());
        let letter = currTile.innerText;

        //Is it in the correct position?
        if (words[c] == letter) {
            currTile.classList.add("correct");
            correct += 1;
        } // Is it in the word?
        else if (words.includes(letter)) {
            currTile.classList.add("present");
        } // Not in the word
        else {
            currTile.classList.add("absent");
        }

        if (correct == width) {
            gameOver = true;
			document.getElementById("answer").innerText = "Correct! The word is: " + words;
        }

    }
}