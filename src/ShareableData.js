// Code by Roslyn Michelle Cyrus McConnell (rozmichelle.com)
import React, { useState, Fragment } from 'react'
import {decodeSolution, getShareableData} from './utils/helpers'

const ShareableData = ({ guesses, solutionHash, nrows }) => {
	const [resultsCopied, updatedResultsCopied] = useState(false)
	
	let dataRows = getShareableData(guesses, decodeSolution(solutionHash))
   	
	const getClass = (status) => {
		if (status === 0) {
			return '⬛'
		} else if (status === 1) {
			return '🟨'
		} else if (status === 2) {
			return '🟩'
		} else {
			return '0'
		}
	}

	const copyData = (dataRows) => {
		let str = 'Wordle ' + solutionHash + ' ' + dataRows.length + '/' + nrows + '\n'
		
		dataRows.map((row, _) => {
			row.map((val, _) => {
				str += val
			})
			str += '\n'
		})
		
		navigator.clipboard.writeText(str)
		updatedResultsCopied(true)
	}

	return <Fragment>
		<button className='bigbutton bg_secondary' onClick={() => copyData(dataRows)}>{resultsCopied ? ('Copied!') : ('Copy Results')}</button>
	</Fragment>
}

export default ShareableData