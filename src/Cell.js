// Code by Roslyn Michelle Cyrus McConnell (rozmichelle.com)

const Cell = ({ letter, status }) => {
   const getClass = () => {
	   let c = 'cell cell-'
	   
		if (status === -2) {
			c += 'active'
		} else if (status === -1) {
			c += 'default'
		} else if (status === 0) {
			c += 'wrong'
		} else if (status === 1) {
			c += 'close'
		} else if (status === 2) {
			c += 'correct'
		} else {
			c += 'default'
		}
	   
	   return c
	}

	return (
		<div className={ getClass() }>{ letter }</div>
	)
}

Cell.defaultProps = {
    letter: '',
	status: -1,
	// -1 	--> default
    // 0 	--> not in word
    // 1 	--> in word but in wrong place
	// 2 	--> in correct place in word
};

export default Cell