// Code by Roslyn Michelle Cyrus McConnell (rozmichelle.com)
var Hashids = require("hashids");
var Buffer = require('buffer/').Buffer

const hashids = new Hashids("Wordle for the WIN!")

export const encodeSolution = (word) => {
	let hex = Buffer.from(word, 'utf8').toString('hex')
	let hash = hashids.encodeHex(hex)
	return hash
}
	
export const decodeSolution = (hash) => {
	var decodedHex = hashids.decodeHex(hash)
	var word = Buffer.from(decodedHex, 'hex').toString('utf8')
	return word
}

// assumed solution is decoded
export const getShareableData = (currentGuesses, solution) => {
	var data = [];
	for (var w = 0; w < currentGuesses.length; w++) {
		var currentGuess = currentGuesses[w]
		var datarow = [];
		for (var l = 0; l < currentGuess.length; l++) {
			var status = getCellStatus(solution, l, currentGuess[l])
			
			if (status === 2) {
				status = '🟩' // in correct place in word
			} else if (status === 1) {
				status = '🟨' // in word but in wrong place
			} else { // 0
				status = '⬛' // not in word
			}
			
			datarow.push(status)
		}
		
		data.push(datarow)
	}
	
	return data
}

export const getCellStatus = (solution, col, letter) => {
	if (letter === solution[col]) {
		return 2 // in correct place in word
	} else if (solution.indexOf(letter) > -1) {
		return 1 // in word but in wrong place
	} else {
		return 0 // not in word
	}
}