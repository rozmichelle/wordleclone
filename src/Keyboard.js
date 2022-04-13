// Code by Roslyn Michelle Cyrus McConnell (rozmichelle.com)
import {decodeSolution} from './utils/helpers'

// currentGuesses: array of currently submitted word guesses
// winningHash: a hash of the solution
// guessedLetters: set of all letters that have been guessed so far across all word guesses
// buttonClicked: function in Game that handles the key clicked on this UI keyboard
const Keyboard = ({ currentGuesses, winningHash, guessedLetters, buttonClicked }) => {	
	let winningWord = decodeSolution(winningHash)
	
	const getLetterColor = (letter) => {
		letter = letter.toLowerCase()
		let letterInGuessedList = guessedLetters.has(letter)
		// only change key style if it has been guessed
		if (!letterInGuessedList) return 'key-default'
		
		// see if this letter has been guessed in the correct spot in solution in any guess:
		let letterInRightPlace = false

		for (var w = 0; w < currentGuesses.length; w++) {
			let currentGuess = currentGuesses[w]
			for (var l = 0; l < currentGuess.length; l++) {
				if (currentGuess[l] === winningWord[l] && letter === winningWord[l]) {
					letterInRightPlace = true
					break
				}
			}

			if (letterInRightPlace) break
		}

		let letterInWord = winningWord.indexOf(letter) > -1

		if (letterInRightPlace) {
			return 'cell-correct';
		} else if (letterInWord) {
			return 'cell-close';
		} else if (!letterInWord) {
			return 'key-fail';
		} else {
			return 'key-default'; // shouldn't ever happen
		}
	}
	
	const getKeyboardKeys = (letters) => {
		let keys = letters.split('').map((char) => {
			return <button key={char} value={char} 
						   onClick={(e) => buttonClicked(e)} 
						   className={getLetterColor(char)}>{char}
				   </button>
		})
		
		return keys
	}
		
	return  <div id="keyboardwrapper">
				<div id="keyboard">
					<div className="row">
						{getKeyboardKeys('qwertyuiop')}
					</div>
					<div className="row">
						<div className="gap_sml"></div>
						{getKeyboardKeys('asdfghjkl')}
						<div className="gap_sml"></div>
					</div>
					<div className="row">
						<button value="↵" onClick={(e) => buttonClicked(e)} 
								className='key-default key-enter gap_med'>Enter</button>
						{getKeyboardKeys('zxcvbnm')}
						<button value="←" onClick={(e) => buttonClicked(e)} className='key-default key-backspace gap_med'>&#9003;</button>
					</div>
				</div>
			</div>
}

export default Keyboard