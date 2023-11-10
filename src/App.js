import { useEffect, useReducer } from 'react';
import Header from './layouts/Header';
import Main from './layouts/Main';
import Loader from './components/Loader';
import Error from './components/Error';
import StartScreen from './components/quiz/StartScreen';
import Question from './components/quiz/Question';

const initialState = {
	questions: [],
	status: 'loading', // error, ready, active, finished
};

function reducer(state, action) {
	switch (action.type) {
		case 'dataReceived':
			return {
				...state,
				questions: action.payload,
				status: 'ready',
			};
		case 'dataFailed':
			return {
				...state,
				status: 'error',
			};
		case 'start':
			return {
				...state,
				status: 'active',
			};
		default:
			throw new Error('Error: unknown action');
	}
}

export default function App() {
	const [{ questions, status }, dispatch] = useReducer(reducer, initialState);
	const numQuestions = questions.length;

	useEffect(() => {
		fetch('http://localhost:9000/questions')
			.then((res) => res.json())
			.then((data) => dispatch({ type: 'dataReceived', payload: data }))
			.catch((err) => dispatch({ type: 'dataFailed' }));
	}, []);

	return (
		<div className="app">
			<Header />

			<Main>
				{status === 'loading' && <Loader />}
				{status === 'error' && <Error />}
				{status === 'ready' && <StartScreen numQuestions={numQuestions} dispatch={dispatch} />}
				{status === 'active' && <Question />}
			</Main>
		</div>
	);
}
