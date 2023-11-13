import { useEffect, useReducer } from 'react';
import Header from './layouts/Header';
import Main from './layouts/Main';
import Loader from './components/Loader';
import Error from './components/Error';
import StartScreen from './components/quiz/StartScreen';
import Question from './components/quiz/Question';
import NextButton from './components/quiz/NextButton';
import ProgressBar from './components/quiz/ProgressBar';
import FinishedScreen from './components/quiz/FinishedScreen';
import Timer from './components/quiz/Timer';
import Exit from './components/quiz/Exit';
import PreviousButton from './components/quiz/PreviousButton';
import ButtonGroup from './components/ButtonGroup';

const SEC_PER_QUESTION = 30;
const initialState = {
	questions: [],
	filterQuestions: [],
	status: 'loading', // error, ready, active, finished
	index: 0,
	answer: null,
	answers: [],
	scores: 0,
	highScore: JSON.parse(localStorage.getItem('highScore')) ?? 0,
	remainingTime: null,
	difficulty: 'all',
};

function reducer(state, action) {
	switch (action.type) {
		case 'dataReceived':
			return {
				...state,
				status: 'ready',
				questions: action.payload,
				filterQuestions: action.payload,
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
				remainingTime: state.filterQuestions.length * SEC_PER_QUESTION,
			};
		case 'newAnswer':
			const currentQuestion = state.filterQuestions.at(state.index);
			return {
				...state,
				answer: action.payload,
				scores: action.payload === currentQuestion.correctOption ? state.scores + currentQuestion.points : state.scores,
				answers: [...state.answers, action.payload],
			};
		case 'prevQuestion':
			return {
				...state,
				index: state.index - 1,
				answer: state.answers[state.index - 1],
			};
		case 'nextQuestion':
			return {
				...state,
				index: state.index + 1,
				answer: state.index + 1 < state.answers.length ? state.answers[state.index + 1] : null,
			};
		case 'finishQuiz':
			const highScore = state.scores >= state.highScore ? state.scores : state.highScore;
			localStorage.setItem('highScore', JSON.stringify(highScore));
			return {
				...state,
				status: 'finished',
				highScore,
			};
		case 'restart':
			return {
				...initialState,
				status: 'ready',
				questions: state.questions,
				filterQuestions: state.filterQuestions,
				highScore: state.highScore,
				difficulty: state.difficulty,
			};
		case 'timer':
			return {
				...state,
				remainingTime: state.remainingTime - 1,
				status: state.remainingTime === 0 ? 'finished' : state.status,
			};
		case 'setDifficulty':
			const filteredQuestions = state.questions.filter((question) => question.difficulty === action.payload);

			return {
				...state,
				difficulty: action.payload,
				filterQuestions: action.payload === 'all' ? state.questions : filteredQuestions,
			};
		default:
			throw new Error('Error: unknown action');
	}
}

export default function App() {
	const [{ status, index, answer, scores, highScore, remainingTime, difficulty, filterQuestions }, dispatch] = useReducer(reducer, initialState);
	const numQuestions = filterQuestions.length;
	const totalScores = Array.isArray(filterQuestions) ? filterQuestions.reduce((prev, crr) => prev + crr.points, 0) : 0;

	useEffect(() => {
		const API_URL = process.env.REACT_APP_API_URL;
		const apiEnvironmentMode = process.env.NODE_ENV === 'production' ? `${API_URL}/questions.json` : `${API_URL}/questions`;

		fetch(apiEnvironmentMode)
			.then((res) => res.json())
			.then((data) => {
				console.log('Fetched Data:', data);
				dispatch({ type: 'dataReceived', payload: data });
			})
			.catch(() => dispatch({ type: 'dataFailed' }));
	}, []);

	return (
		<div className="app">
			<Header />

			<Main>
				{status === 'loading' && <Loader />}
				{status === 'error' && <Error />}
				{status === 'ready' && <StartScreen numQuestions={numQuestions} dispatch={dispatch} highScore={highScore} difficulty={difficulty} />}

				{status === 'active' && (
					<>
						<ProgressBar index={index} numQuestions={numQuestions} answer={answer} scores={scores} totalScores={totalScores} />

						<Question question={filterQuestions[index]} answer={answer} dispatch={dispatch} />

						<ButtonGroup>
							<PreviousButton dispatch={dispatch} index={index} />
							<NextButton dispatch={dispatch} answer={answer} index={index} numQuestions={numQuestions} />
						</ButtonGroup>

						<ButtonGroup className="footer">
							<Exit dispatch={dispatch} />
							<Timer dispatch={dispatch} remainingTime={remainingTime} />
						</ButtonGroup>
					</>
				)}

				{status === 'finished' && <FinishedScreen scores={scores} totalScores={totalScores} highScore={highScore} dispatch={dispatch} />}
			</Main>
		</div>
	);
}
