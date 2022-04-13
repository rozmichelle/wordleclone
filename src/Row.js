import Cell from "./Cell";
import {decodeSolution} from './utils/helpers'

const Row = ({ letters, solutionHash, isSubmitted, rowIsActive, activeCol }) => {
	let solution = decodeSolution(solutionHash)
	
	const genCellsInRow = (rowData = letters) => {
		function isActiveCell(col) {
			// must be an empty cell that the user is currently on
			return rowIsActive && col === activeCol
		}
		
		let solutionArray = solution.split('')
		
		// solution: 	SenSe
		// guess:		SasSY
		/*
		map each letter in guessed word to array of indices of correctly placed letters:
			{
				's': [0, 3], // 2 's' correctly placed
				'a': [],
				'y': [],
			}
		*/
		const generateMap = (rowData) => {
			let mappy = {}
			for (var i = 0; i < solution.length; i++) {
				let guessedLetter = rowData[i]
				if (!mappy[guessedLetter]) mappy[guessedLetter] = []
				
				if (solution[i] === guessedLetter) {
					mappy[guessedLetter].push(i)
				}
			}
			
			return mappy
		}
		
		let mappy = generateMap(rowData)
		
//		console.log(JSON.stringify(mappy))
		
		function getStatus(col, letter) {
			if (isActiveCell(col)) return -2 // active
			if (!isSubmitted) return -1 // default	
			
			let letterPosition = solutionArray.indexOf(letter)
			
			if (solution[col] === letter) {
				solutionArray[col] = null
				const index = mappy[letter].indexOf(col);
				if (index > -1) { // should always be true...
					mappy[letter].splice(index, 1);
				}
				//console.log('update ' + JSON.stringify(mappy))
				return 2 // in correct place in word
			} 
			
			else if (letterPosition > -1) {
				//console.log('solutionArray ' + solutionArray)
				let numTimesLetterInGuess = (solutionArray.join().match(new RegExp(letter, "g")) || []).length;
				solutionArray[letterPosition] = null
//				console.log('numTimesLetterInGuess ' + numTimesLetterInGuess)
				if (mappy[letter].length - numTimesLetterInGuess !== 0) { // # correct - # guessed !== 0
					return 1
				}
				else {
					return 0
				}
				// in word but in wrong place
			} 
			
			else if (letterPosition === -1) {
				return 0 // not in word
			}
		}
		
        // Returns the row of cells by reading the prop row array
        const cells = rowData.map((letter, col) => {
			return <Cell key = {col}
						     letter = {letter}
						     status = {getStatus(col, letter)} />
		})

		return cells
    }

	return <div className='row'>{genCellsInRow()}</div>
}

export default Row