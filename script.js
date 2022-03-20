const header = document.getElementsByTagName("header")[0];
const guesses = document.getElementById("guesses");
const keyboard = document.getElementById("keyboard");
const pageHeight = document.documentElement.clientHeight;
const pageWidth = document.documentElement.clientWidth;

// Calculate how much space is left for the guesses and keyboard
heightSplit = 0.8;
remainingHeight = pageHeight - header.clientHeight;

// Dynamically set the guesses and keyboard height
guesses.setAttribute("style", `height: ${Math.floor(remainingHeight * heightSplit)}px`)
keyboard.setAttribute("style", `height: ${Math.floor(remainingHeight * (1- heightSplit))}px`)