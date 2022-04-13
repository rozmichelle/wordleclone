// Code by Roslyn Michelle Cyrus McConnell (rozmichelle.com)
import Cell from "./Cell";
import {decodeSolution, getCellStatus} from './utils/helpers'

const Row = ({ letters, solutionHash, isSubmitted, rowIsActive, activeCol }) => {
	let solution = decodeSolution(solutionHash)
	
	const genCellsInRow = (letters) => {		
		function getStatus(col, letter) {
			if (rowIsActive && col === activeCol) return -2 // active cell that user is on
			else if (!isSubmitted) return -1 // default
			else return getCellStatus(solution, col, letter) // handles submitted guess hint states
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