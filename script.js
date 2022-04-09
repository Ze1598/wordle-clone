const header = document.getElementsByTagName("header")[0];
const guesses = document.getElementById("guesses");
const keyboard = document.getElementById("keyboard");
const pageHeight = document.documentElement.clientHeight;
const pageWidth = document.documentElement.clientWidth;
const guessesArray = document.getElementsByClassName("guess");
window.addEventListener("keydown", physicalKeyClicked);

const victoryEasterEgg = new Audio("victory.mp3");

const greenCorrect = "rgb(83, 141, 78)"
const yellowPresent = "rgb(201, 180, 88)"
const greyAbsent = "rgb(58, 58, 60)"
const warningColour = "rgb(214, 124, 0)"
const colours = [greenCorrect, yellowPresent, greyAbsent]

// Starts at 1
let guessNumber = 1;
let currentGuessElement = guessesArray[guessNumber - 1];
let guessedWord = "";
let guessLetterCounts = {};
let solution = wordPool[Math.floor(Math.random()*wordPool.length)];
// Missed positions show as underscore, otherwise show guessed letter
progressString = "";

// solution = "mound"
// solution = "muddy"

// solution = "pasta"

// solution = "snort"
// solution = "sorry"

// solution = "dwelt"
// solution = "dwell"

// solution = "stole"
// solution = "steel"

// solution = "award"
// solution = "awoke"

// solution = "enema"
// solution = "eerie"

let solutionLetterCounts = {}
for (i = 0; i < 5; i++) {
	// ?? is the nullish operator aka coalesce
	solutionLetterCounts[solution[i]] = (solutionLetterCounts[solution[i]] !== undefined ?? 0) + 1
	// solutionLetterCounts[solution[i]] = (solutionLetterCounts[guessedWord[i]] === undefined ? 0 : solutionLetterCounts[guessedWord[i]]) + 1
}

// https://github.com/apvarun/toastify-js
shortGuessToast = Toastify({
	text: "Guess is too short",
	position: "center",
	style: {
		background: warningColour,
	}
})

invalidGuessToast = Toastify({
	text: "Invalid guess",
	position: "center",
	style: {
		background: warningColour,
	}
})
victoryToast = Toastify({
	text: "You win!!! Game will reset in 3 seconds",
	position: "center",
	style: {
		background: warningColour,
	},
	callback: resetGame
})
gameOverToast = Toastify({
	text: `Out of guesses. The solution is ${solution}. Game will reset in 3 seconds`,
	position: "center",
	style: {
		background: warningColour,
	},
	callback: resetGame
})

console.log(solution)

// Set guesses and keyboard height dynamically
// heightSplit = 0.8;
// remainingHeight = pageHeight - header.clientHeight;
// guesses.setAttribute("style", `height: ${Math.floor(remainingHeight * heightSplit)}px`)
// keyboard.setAttribute("style", `height: ${Math.floor(remainingHeight * (1- heightSplit))}px`)

function resetGame() {
	location.reload();
}

// Handle physical keyboard click and pass the value to the key handling function
function physicalKeyClicked(e) {
	let keyNumCode = e.which;
	let keyText = e.code;
	if (
		(keyNumCode >= 65 && keyNumCode <= 90)
		|| keyText === "Backspace"
		|| keyText === "Enter"
	) {
		keyClicked(e.key);
	}
}

// On keyboard key click
function keyClicked(letter) {
	// Delete (last) letter
	if (letter === "Backspace") {
		if (guessedWord.length > 0) {
			guessedWord = guessedWord.slice(0, -1);
		}
	}
	// Append new letter
	else if (
		(guessedWord.length < 5)
		&& (letter !== "Enter")
	) {
		guessedWord += letter.toLowerCase();
	}
	// loop through guessedWord and update each guess cell with each letter
	populateGuess();

	// Guess submitted
	if (letter === "Enter") {
		let guessLength = guessedWord.length;
		if (guessLength < 5) {		  
			shortGuessToast.showToast();
	
		} 
		else if (!wordPool.includes(guessedWord)) {
			invalidGuessToast.showToast();
		} 
		else {
			validateGuess()
			if (
				(guessNumber >= 6)
				|| (guessedWord === solution)
			) {
				gameEnd();
			}
			// Reset guess and increment guess count
			guessedWord = "";
			guessNumber += 1;
		}
	}
}


// Display letters for the current guess on screen every time the user touches a keyboard key
function populateGuess() {
	currentGuessElement = guessesArray[guessNumber - 1];
	guessLetterArray = currentGuessElement.getElementsByClassName("guess-letter");
	guessedLetters = guessedWord.length;
	
	// Draw each letter
	for (let i = 0; i < guessedWord.length; i++) {
		guessLetterArray[i].innerText = guessedWord[i]
	}

	// Ensure squares are empty if the guess has less than 5 letters
	for (let i = guessedLetters; i < 5; i++) {
		guessLetterArray[i].innerText = "";
	}
}


// Update the string that shows which letter have been correctly guessed and shows an underscore for others
// e.g. A__S_ means the users has guessed two letters for ARISE
function updateProgress () {
	tempString = "";
	// Reset count for new guess
	guessLetterCounts = {}
	// Get letter counts for the guess and latest progress
	for (i = 0; i < 5; i++) {
		guessLetterCounts[guessedWord[i]] = (guessLetterCounts[guessedWord[i]] === undefined ? 0 : guessLetterCounts[guessedWord[i]]) + 1
		
		// progressString is empty only on first guess, other guesses update progressString accordingly
		if (guessNumber === 1) {
			if (guessedWord[i] === solution[i]) {
				tempString = tempString + guessedWord[i];
			} 
			else {
				tempString = tempString + "_";
			}
		} 
		else {
			if (guessedWord[i] === solution[i]) {
				tempString = tempString + guessedWord[i];
			}  
			else if (progressString[i] !== "_") {
				tempString = tempString + progressString[i];
			}
			else {
				tempString = tempString + "_";
			}
		}
	}
	progressString = tempString
}


function validateGuess() {

	// Get an array of the current guess display cells
	currentGuessElement = guessesArray[guessNumber - 1];
	guessLetterArray = currentGuessElement.getElementsByClassName("guess-letter");
	updateProgress()
	let seenLetters = []

	// Change display colours for keyboard and guess board
	for (let i = 0; i < 5; i++) {
		currentLetter = guessedWord[i];
		// Need more than 1 of this letter?
		isMultipleInstanceNeeded = solutionLetterCounts[currentLetter] > 1;
		// Keyboard key for this letter
		keyboardKey = document.getElementById(`letter-${currentLetter}`)
		guessOtherLetters = guessedWord.slice(0, i) + guessedWord.slice(i+1)
		// Counts of the current letter in the guess
		currentLetterCounts = guessLetterCounts[currentLetter]
		// Counts needed for the current letter in the solution
		currentLetterCountsNeeded = solutionLetterCounts[currentLetter]
		// Correct counts for current letter so far
		currentLetterCountsCorrect = progressString.split(currentLetter).length - 1
		// Compare the count of correct guesses for the current letter with the count needed for the solution 
		needMoreOfCurrentLetter = currentLetterCountsNeeded > currentLetterCountsCorrect
		// How many times was this letter seen already
		countSeen = seenLetters.filter(x => x === currentLetter).length

		// Count how many more of this letter there are in the guess
		currentLetterCountInRestOfGuess = 0
		for (j = 0; j < 5; j++) {
			if (
				(i !== j) 
				&& (guessedWord[j] === currentLetter)
			) {
				currentLetterCountInRestOfGuess++
			}
		}

		console.log(currentLetter)

		// GREEN
		if (currentLetter == solution[i]) {
			if (
				(isMultipleInstanceNeeded) 
				&& (currentLetterCounts !== currentLetterCountsNeeded)
			) {
				keyboardKey.setAttribute("style", `background-color: ${yellowPresent}`);
				keyboardKey.classList.add("present-letter");
			} else {
				keyboardKey.setAttribute("style", `background-color: ${greenCorrect}`);
				keyboardKey.classList.add("correct-letter");
			}
			// guessLetterArray[i].setAttribute("style", `background-color: ${greenCorrect}`);
			guessLetterArray[i].classList.add("correct-letter");
		} 
		// GREY
		else if (!solution.includes(currentLetter)) {
			keyboardKey.setAttribute("style", `background-color: ${greyAbsent}`);
			keyboardKey.classList.add("absent-letter");
			// guessLetterArray[i].setAttribute("style", `background-color: ${greyAbsent}`);
			guessLetterArray[i].classList.add("absent-letter");
		}
		// YELLOW			
		else {
			// Need multiple letters and guess includes multiple
			if (
				(isMultipleInstanceNeeded) 
				&& (
					(currentLetterCounts <= currentLetterCountsNeeded)
					|| (countSeen <= (currentLetterCountsNeeded - currentLetterCountsCorrect) )
				)
			) {
				keyboardKey.setAttribute("style", `background-color: ${yellowPresent}`);
				keyboardKey.classList.add("present-letter");
				// guessLetterArray[i].setAttribute("style", `background-color: ${yellowPresent}`);
				guessLetterArray[i].classList.add("present-letter");
			}
			// Need one of this letter
			else if (
				(currentLetterCountsCorrect < currentLetterCountsNeeded)
				&& (
					(currentLetterCountInRestOfGuess < currentLetterCounts)
					&& (!seenLetters.includes(currentLetter))
				)
			) {
				if (!keyboardKey.style.backgroundColor) {
					keyboardKey.setAttribute("style", `background-color: ${yellowPresent}`);
					keyboardKey.classList.add("present-letter");
				}
				// guessLetterArray[i].setAttribute("style", `background-color: ${yellowPresent}`);
				guessLetterArray[i].classList.add("present-letter");
			}
			// Tried already correct letter in a new position, then make only the board yellow
			else if (
				(currentLetterCountsCorrect === currentLetterCountsNeeded)
				&& (
					(currentLetterCountInRestOfGuess < currentLetterCountsCorrect)
					&& (!seenLetters.includes(currentLetter))
				)
			) {
				guessLetterArray[i].classList.add("present-letter");
			}
			// Already have enough
			else {
				// Don't change the keyboard colour, but reflect that the letter is not needed in the guess
				if (!keyboardKey.style.backgroundColor) {
					keyboardKey.setAttribute("style", `background-color: ${greyAbsent}`);
					keyboardKey.classList.add("absent-letter");
				}
				// guessLetterArray[i].setAttribute("style", `background-color: ${greyAbsent}`);
				guessLetterArray[i].classList.add("absent-letter");
			}
		}

		seenLetters.push(currentLetter)

	}
}

function gameEnd() {

	// Prompt user to reset the game if they didn't win in 6 guesses
	if ((guessNumber === 6) && (guessedWord !== solution)) {
		gameOverToast.showToast()
	}

	// Prompt user to reset game upon victory
	if (guessedWord == solution) {
		// Easter egg for first try win
		if (guessNumber === 1) {
			victoryEasterEgg.play();
		}
		victoryToast.showToast()
	}
}