import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Game from './Game';

/**
 * This describes a simple React App with one route "/".
 * It currently has no constraints though these can be added by adding attributes "exact strict" to the Route tag.
 */
const App = () => {
    return (
		<BrowserRouter>
			<Routes>
				<Route path="/wordle" element={<Game numletters={5} />} />
				<Route path="/wordle/:wordID" element={<Game numletters={5} />} />
			</Routes>
		</BrowserRouter>
    )
}

export default App;
