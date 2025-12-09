// Gets the memoryCard list
const cards = document.querySelectorAll('.memoryCard');

let hasFlippedCard = false;
let lockBoard = false
let firstCard, secondCard;

function flipCard() {
	if (lockBoard) return;
	if (this === firstCard) return; 

	// Tests if it works by logging to console:
	//console.log('Card has been flipped');
	//console.log(this);

	// Toggles the 'flip' class on the clicked card. Visible in elements tab of inspectio tool for testing
	this.classList.toggle('flip');

	if (!hasFlippedCard) {
		// First click
		hasFlippedCard = true;
		firstCard = this;

		// Tests if it works by logging to console:
		//console.log({ hasFlippedCard, firstCard });
	} else {
		// Second click
		hasFlippedCard = false;
		secondCard = this;
		lockBoard = true;
		
		// Tests if it works by logging to console:
		//console.log({ firstCard, secondCard });

		// Checks for match
		if (firstCard.dataset.framework === secondCard.dataset.framework) {
			// Logs to console if a match is found for testing:
			//console.log('You found a match!');
			
			// Disables event listeners on matched cards
			firstCard.removeEventListener('click', flipCard);
			secondCard.removeEventListener('click', flipCard);
			resetBoard();
		} else {
			// Not a match
			setTimeout(() => {
			firstCard.classList.remove('flip');
			secondCard.classList.remove('flip');
			resetBoard();
			}, 1000);
		}
		
	}
	
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// Shuffle
(function shuffle() {
	cards.forEach(card => {
		let randomPos = Math.floor(Math.random()* 12);
		card.style.order = randomPos
	});
})();

// Adds an event listener to each card and when activated, calls flipCard function and flips them
cards.forEach(card => card.addEventListener('click', flipCard));
