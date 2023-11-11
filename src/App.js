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
	status: 'loading', // error, ready, active, finished
	index: 0,
	answer: null,
	answers: [],
	scores: 0,
	highScore: JSON.parse(localStorage.getItem('highScore')) ?? 0,
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
				questions: state.questions,
				status: 'ready',
				highScore: state.highScore,
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
				{status === 'ready' && <StartScreen numQuestions={numQuestions} dispatch={dispatch} highScore={highScore} />}

				{status === 'active' && (
					<>
						<ProgressBar index={index} numQuestions={numQuestions} answer={answer} scores={scores} totalScores={totalScores} />

						<Question question={questions[index]} answer={answer} dispatch={dispatch} />

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
