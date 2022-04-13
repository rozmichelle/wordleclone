// Code by Roslyn Michelle Cyrus McConnell (rozmichelle.com)

import Cell from "./Cell";
import {decodeSolution} from './utils/helpers'

const Row = ({ letters, solutionHash, isSubmitted, rowIsActive, activeCol }) => {
	let solution = decodeSolution(solutionHash)
	
	const genCellsInRow = (letters) => {		
		function getStatus(col, letter) {
			// must be an empty cell that the user is currently on
			if (rowIsActive && col === activeCol) return -2 // active
			else if (!isSubmitted) return -1 // default	
			
			else if (letter === solution[col]) {
				return 2 // in correct place in word
			}
			
			else if (solution.indexOf(letter) > -1) {
				return 1 // in word but in wrong place
			} 
			
			else {
				return 0 // not in word
			}
		}
		
        // Returns the row of cells by reading the prop row array
        const cells = letters.map((letter, col) => {
			return <Cell key = {col}
						 letter = {letter}
						 status = {getStatus(col, letter)} />
		})

		return cells
    }

	return <div className='row'>{genCellsInRow(letters)}</div>
}

export default Row