const header = document.getElementsByTagName("header")[0];
const guesses = document.getElementById("guesses");
const keyboard = document.getElementById("keyboard");
const pageHeight = document.documentElement.clientHeight;
const pageWidth = document.documentElement.clientWidth;
const guessesArray = document.getElementsByClassName("guess");

// Starts at 1
let guessNumber = 1;
let currentGuessElement = guessesArray[guessNumber - 1];
let attemptWord = "";

// Calculate how much space is left for the guesses and keyboard
heightSplit = 0.8;
remainingHeight = pageHeight - header.clientHeight;

// Dynamically set the guesses and keyboard height
guesses.setAttribute("style", `height: ${Math.floor(remainingHeight * heightSplit)}px`)
keyboard.setAttribute("style", `height: ${Math.floor(remainingHeight * (1- heightSplit))}px`)

// Check for valid word, enough letters, increment guessNumber
function pressEnter() {}

// On keyboard key click
function keyClicked(letter) {
		// Attempt submitted
		if (letter === "Enter") {
			// Add logic to check for valid attempt
			alert("Attempt submitted")
			attemptWord = "";
		}
		// Delete letter
		else if (letter === "Backspace") {
			if (attemptWord.length > 0) {
				attemptWord = attemptWord.slice(0, -1);
			}
		}
		// Add new çetter
		else if (attemptWord.length < 6) {
			attemptWord += letter;
		}
		// Max length reached
		else {
			alert("Too long")
		}
		// loop through attemptWord and update each guess cell with each letter
		console.log(attemptWord)
		populateGuess();
}

// Display letters for the current guess on screen every time the user touches a keyboard key
function populateGuess() {
	// Need a mechanism to clean up letters after backspace
	guessLetterArray = currentGuessElement.getElementsByClassName("guess-letter");
	for (let i=0; i < attemptWord.length; i++) {
		guessLetterArray[i].innerText = attemptWord[i]
	}
}