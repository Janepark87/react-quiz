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

const SEC_PER_QUESTION = 30;
const initialState = {
	questions: [],
	status: 'loading', // error, ready, active, finished
	index: 0,
	answer: null,
	scores: 0,
	highScore: 0,
	remainingTime: null,
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
				remainingTime: state.questions.length * SEC_PER_QUESTION,
			};
		case 'newAnswer':
			const currentQuestion = state.questions.at(state.index);
			return {
				...state,
				answer: action.payload,
				scores: action.payload === currentQuestion.correctOption ? state.scores + currentQuestion.points : state.scores,
			};
		case 'nextQuestion':
			return {
				...state,
				index: state.index + 1,
				answer: null,
			};
		case 'finishQuiz':
			return {
				...state,
				status: 'finished',
				hightScore: state.highScore === 0 ? Math.max(state.scores, state.highScore) : state.highScore,
			};
		case 'restart':
			return {
				...initialState,
				questions: state.questions,
				status: 'ready',
			};
		case 'timer':
			return {
				...state,
				remainingTime: state.remainingTime - 1,
				status: state.remainingTime === 0 ? 'finished' : state.status,
			};
		default:
			throw new Error('Error: unknown action');
	}
}

export default function App() {
	const [{ questions, status, index, answer, scores, highScore, remainingTime }, dispatch] = useReducer(reducer, initialState);
	const numQuestions = questions.length;
	const totalScores = questions.reduce((prev, crr) => prev + crr.points, 0);

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
				{status === 'active' && (
					<>
						<ProgressBar index={index} numQuestions={numQuestions} answer={answer} scores={scores} totalScores={totalScores} />

						<Question question={questions[index]} answer={answer} dispatch={dispatch} />

						<div>
							<Timer dispatch={dispatch} remainingTime={remainingTime} />
							<NextButton dispatch={dispatch} answer={answer} index={index} numQuestions={numQuestions} />
						</div>
					</>
				)}
				{status === 'finished' && <FinishedScreen scores={scores} totalScores={totalScores} highScore={highScore} dispatch={dispatch} />}
			</Main>
		</div>
	);
}
