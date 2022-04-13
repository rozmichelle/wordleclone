// Code by Roslyn Michelle Cyrus McConnell (rozmichelle.com)
import React, { useState, Fragment } from 'react'
import {decodeSolution, getShareableData, appRoot} from './utils/helpers'

const ShareableData = ({ guesses, solutionHash, nrows }) => {
	const [resultsCopied, updatedResultsCopied] = useState(false)
	
	let dataRows = getShareableData(guesses, decodeSolution(solutionHash))

	const copyData = (dataRows) => {
		let str = 'Wordle ' + dataRows.length + '/' + nrows + ' ' + appRoot + solutionHash + '\n'
		
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
		<button className='bigbutton bg_secondary' onClick={() => copyData(dataRows)}>{resultsCopied ? ('Results Copied') : ('Copy Results')}</button>
	</Fragment>
}

export default ShareableData