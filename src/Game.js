import React, { useEffect, useState, useCallback, Fragment } from 'react'
import {useParams, useNavigate} from "react-router-dom"
import {dictionaries, isWord} from './utils/dictionary'
import {encodeSolution, decodeSolution} from './utils/helpers'
import Row from "./Row"
import Keyboard from "./Keyboard"

const Game = () => {
	let navigate = useNavigate()
	let params = useParams()
	
	const initWord = (numletters) => {
		let words = dictionaries[numletters].small // @todo ensure it exists
		let index = Math.floor(Math.random() * words.length)
		let word = words[index].toLowerCase()
		return word
	};

	const initGrid = (nrows, numletters) => {
        /* It initializes grid as a 2D string array:
		[
			  ['', '', '', '', ''],
			  ['', '', '', '', ''],
			  ['', '', '', '', ''],
			  ['', '', '', '', ''],
			  ['', '', '', '', ''],
			  ['', '', '', '', ''],
		]
		*/
        let grid = []
        for (let y = 0; y < nrows; y++) {
            let row = []
            for (let x = 0; x < numletters; x++) row.push('')	
            grid.push(row)
        }
		
        return grid
    }
	
	const getUnloadedState = () => {
		return {
			gameLoaded: false,
			grid: null,
			winningHash: null,
			guessedLetters: new Set(),
			ncols: 0,
			nrows: 0,
			currentRow: 0, // that user is on
			currentCol: 0,
			winningState: 0 // -1: lost, 0: freshly loaded game, 1: new round, 2: won
		}
	}
	
	const getInitialState = useCallback( (isNewRound = false, numletters = 5, hash = null) => {
		//console.log('initializing...')
		const nrows = numletters + 1; // always give one more guess than the # of letters in word
		const g = initGrid(nrows, numletters)
		
		if (!hash) {
			let w = initWord(numletters) // word length determines ncols
			hash = encodeSolution(w)
		}
		
		return {
			gameLoaded: true,
			grid: g,
			winningHash: hash, // only store hash so the solution isn't visible in devtools (for the curious :)
			guessedLetters: new Set(),
			ncols: numletters, // decodeSolution(hash).length,
			nrows: nrows,
			currentRow: 0, // that user is on
			currentCol: 0,
			winningState: isNewRound ? 1 : 0 // -1: lost, 0: freshly loaded game, 1: new round, 2: won
		}
	}, [])
	
	const [gameOverMessage, updateGameOverMessage] = useState('empty')
	const [gameState, updateGameState] = useState(() => { return {...getUnloadedState()} })
	const {gameLoaded, grid, winningHash, guessedLetters, currentRow, nrows, ncols,
		    currentCol, winningState } = gameState;
	
	const getUrlParam = useCallback( () => {
		let paramWord = params.wordID;	
		return (paramWord === undefined) ? null : paramWord
	}, [params.wordID])

	const genRows = () => {
        function getRow(rowArr, rowIdx){
			return <Row key={ rowIdx }
					   letters = { rowArr }
					   solutionHash = { winningHash }
					   isSubmitted = { rowIdx < currentRow }
					   rowIsActive = { rowIdx === currentRow && 
							(winningState === 0 || winningState === 1) }
					   // above state check is in case we go to next row but game is over
					   activeCol = { currentCol }
					/>			   
		}
		
        const gridRows = grid.map((rowArr, rowIdx) => getRow(rowArr, rowIdx))
        return gridRows
    }
	
	const GetGameButtons = () => {
		return  <Fragment>
					<button className='bigbutton' onClick={() => startGame(5, false)}>Play 5 Letters</button>
					<button className='bigbutton' onClick={() => startGame(6, false)}>PLay 6 Letters</button>	
				</Fragment>
	}
	
	const getPlayAgainData = (id) => {
		return  <Fragment>
					<button className='bigbutton' onClick={() => startGame(ncols, true)}>Play again</button>
					<div className='closeButton' onClick={() => closeAlert(id)}>&#10799;</div>
				</Fragment>
	}
	
	const startGame = (numletters, playAnotherRound) => {
		closeAllAlerts()
		updateGameState(() => { return {...getInitialState(playAnotherRound, numletters)} })
	}
	
	const closeAllAlerts = () => {
		closeAlert('alert')
		closeAlert('intro')
		closeAlert('winner')
		closeAlert('loser')
	}
	
	const closeAlert = (id) => {
		let element = document.getElementById(id)
		if (!element) return
		  
		element.style.opacity = '0'
		element.style.visibility = 'hidden'
	}	

	const updateState = useCallback((letter, backspaceEvent, enterEvent) => {
		function duplicate(grid){
            let newGrid = grid.map(row=>{
                return [...row]
            })
            return newGrid
        }
		
		const showAlert = (id, text) => {
			let element = document.getElementById(id);

			if (element) {
				closeAlert('alert'); 
				closeAlert('intro'); 
				element.firstChild.innerHTML = text;
				element.style.visibility = 'visible'
				element.style.opacity = '1.0';
			}
		}
		
		const showWinAlert = (currentRow, nrows) => {
			updateGameOverMessage('You found the word in ' + (currentRow + 1) + ' of ' + nrows + ' moves')

			let element = document.getElementById('winner');

			if (element) {
				closeAlert('alert');
//				element.style.display = 'block'
				element.style.visibility = 'visible'
				element.style.opacity = '1.0' 
			}
		}
		
		const showLoseAlert = (winningHash) => {
			updateGameOverMessage(decodeSolution(winningHash))

			let element = document.getElementById('loser');

			if (element) {
				closeAlert('alert');
				element.style.visibility = 'visible'
				element.style.opacity = '1.0'; // element.style.display = 'block';
			}
		}
		
		updateGameState(currSt => {
            let newGrid = duplicate(currSt.grid)
			let newRow = currSt.currentRow
			let newCol = currSt.currentCol
			let newWinningState = currSt.winningState
			let newGuessedLetters = currSt.guessedLetters
			
			function checkWord(word) {
				return (word === decodeSolution(currSt.winningHash))
			}

			// make sure game is not won or lost and that we are in bounds
            if( (newWinningState !== 2 && newWinningState !== -1 
				 && newRow >= 0 && newRow <= newGrid.length-1) && 
			     newCol >= 0 && newCol <= newGrid[0].length-1) {
				let currentWord = newGrid[newRow].join('')
				
                if (backspaceEvent) { // don't handle keyboard events if game won
					// go to previous letter if not at end
					newCol = (newCol === 0 || (newCol === newGrid[0].length-1 && newGrid[newRow][newCol] !== '')) ? newCol : newCol - 1; 
					
					newGrid[newRow][newCol] = ''
                }
				
				else if (enterEvent) {
					if (newCol === newGrid[0].length-1 && newGrid[newRow][newCol] !== '') {
						// only handle enter event if user entered last letter in word
						if (!isWord(currentWord, currSt.ncols)) {
							showAlert('alert', 'Please enter a valid word')
						} else {
							newGuessedLetters = new Set([...newGuessedLetters, ...newGrid[newRow]])

							if (checkWord(currentWord)) {
								newWinningState = 2
								showWinAlert(currentRow, nrows)

							} else if (newRow === newGrid.length - 1) {
								// if last row, game over
								newWinningState = -1
								showLoseAlert(winningHash)
							} else {
								closeAlert('alert'); // clear possible error alert
							}

							// go to next row
							newCol = 0
							newRow++
						}
					} else {
						showAlert('alert', 'Please enter ' + currSt.ncols + ' letters')
					}
                }
				
				// otherwise, letter typed. ensure it's a letter and not weird character
				else if (newGrid[newRow][newCol] === '' 
						 && letter.length 
						 && letter.match(/^[a-z]$/i) ) 
				{ 
                    newGrid[newRow][newCol] = letter
					newCol = (newCol === newGrid[0].length - 1) ? newCol : newCol + 1; 
					// go to next letter if not at end, otherwise, 
					// stay at end and wait for user to hit enter or backspace
                }
            }

			return {
				...currSt,
                grid: newGrid,
				currentRow: newRow,
				currentCol: newCol,
                winningState: newWinningState,
				guessedLetters: newGuessedLetters
            }
        })	
	}, [currentRow, nrows, winningHash])
    
	 const handleKeyboardEvent = useCallback((event) => {
		if (!gameLoaded) return
		
		let letter = '';
		let backspaceEvent = false;
		let enterEvent = false;
		
		function letterTyped() {
            var charCode = event.keyCode;
            return ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123))
		}
		
		if (letterTyped()) {
			letter = event.key.toLowerCase()
		}
		
		else if (event.keyCode === 8) {
			backspaceEvent = true
    	}
		
		else if (event.keyCode === 13) {
			// prevent letter from being entered in grid when clicking letter then hitting enter on keyboard
			event.preventDefault()
			enterEvent = true
    	}
		
		else return // not a key we care about
		
		updateState(letter, backspaceEvent, enterEvent)	
	}, [gameLoaded, updateState])

	// triggered via Keyboard component
	const buttonClicked = (event) => {
		let letter = event.target.value === '←' || event.target.value === '↵' ? 
			'' : event.target.value;
		updateState(letter, event.target.value === '←', event.target.value === '↵')
	}

	useEffect(() => {
		// behaves like componentWillMount
		window.addEventListener('keydown', handleKeyboardEvent, false);
        return function cleanup() {
            // behaves like componentWillUnmount
			window.removeEventListener('keydown', handleKeyboardEvent, false);
        };
    }, [handleKeyboardEvent]);
	
	useEffect(() => {		
		let urlparam = getUrlParam();
		
		if (urlparam && !gameLoaded) {
			// prep to load game; first see if param is valid; otherwise, new game
			let urlparamvalid = urlparam.match(/^[0-9a-z]+$/i)
			if (!urlparamvalid) {
				navigate('/wordle') // go to load game screen
				return;
			}

			let word = decodeSolution(urlparam)
			let len = word.length
			
			if ((len !== 5 && len !== 6) || !isWord(word, len)) {
				navigate('/wordle') // go to load game screen
				return;
			}
			
			// load game (sets gameLoaded to true, which will rerun this function and go to below else statement)
			updateGameState(() => { return {...getInitialState(false, len, urlparam)} })
		} else if (gameLoaded) {
			// no url param; wait until game loaded to redirect to solution hash
			navigate('/wordle/' + winningHash)
		}
		
		// winningHash !== null && console.log("Solution: " + decodeSolution(winningHash))
		
    }, [getUrlParam, gameLoaded, getInitialState, ncols, navigate, winningState, winningHash]);
		
	return (
		<Fragment>
		{gameLoaded ? (
			<Fragment>
				<header className="App-header">
					<h1>
					  Wordle Clone
					</h1>
				</header>
				<div className='outside'>
					<div className={'Board ar-' + ncols + '-' + (ncols + 1)}>
						{genRows()}
					</div>
				</div>

				<Keyboard currentGuesses={grid.slice(0, currentRow)} 
						  winningHash={winningHash} 
						  guessedLetters={guessedLetters}
						  buttonClicked={buttonClicked} 
				/>
				
				<div id='winner'>
					<div className='neon-green'>Nice job!</div>
					<p><strong>{ gameOverMessage }</strong></p>
					{ getPlayAgainData('winner') }
				</div>
				
				<div id='loser' style={{visibility: winningState === -1 ? 'visible' : 'hidden'}}>
					<div className='neon-red'>Game over...</div>
					<p>The correct word is <strong>{ gameOverMessage }</strong></p>
					{ getPlayAgainData('loser') }
				</div>

				<div id='alert'>
					<span></span>
					<div className='closeButton' onClick={() => closeAlert('alert')}>&#10799;</div>
				</div>

				{ (winningState === 2 || winningState === -1) && (
					<div id='foot'>
						<GetGameButtons />
					</div>
				)}
			</Fragment>
		) : (<div id='intro'>
				<h1>Wordle Clone</h1>
				<p>Find the word in as few guesses as possible within the max number of moves.</p>
				<p>For each guess, letters that are in the solution are shown in yellow. Letters that are also in the correct position are green.</p>
				<hr />
				<h2>Choose Your Game Mode</h2>
				<GetGameButtons />
			</div>
		)}
		</Fragment>
	)
}

export default Game