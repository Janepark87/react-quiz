import { createContext, useContext, useEffect } from 'react';
import { useReducer } from 'react';

const QuizContext = createContext();
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
			const receivedQuestions = process.env.NODE_ENV === 'production' ? action.payload.questions : action.payload;
			return {
				...state,
				status: 'ready',
				questions: receivedQuestions || [],
				filterQuestions: receivedQuestions || [],
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
				index: 0,
			};
		default:
			throw new Error('Error: unknown action');
	}
}

export function QuizProvider({ children }) {
	const [{ status, index, answer, scores, highScore, remainingTime, difficulty, filterQuestions }, dispatch] = useReducer(reducer, initialState);

	const numQuestions = filterQuestions.length;
	const totalScores = filterQuestions.reduce((prev, crr) => prev + crr.points, 0);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const API_URL = process.env.REACT_APP_API_URL;
				const apiEnvironmentMode = process.env.NODE_ENV === 'production' ? `${API_URL}/questions.json` : `${API_URL}/questions`;
				const data = await (await fetch(apiEnvironmentMode)).json();
				dispatch({ type: 'dataReceived', payload: data });
			} catch (error) {
				console.error('Error fetching data:', error);
				dispatch({ type: 'dataFailed' });
			}
		};

		fetchData();
	}, []);

	return (
		<QuizContext.Provider
			value={{ filterQuestions, status, index, answer, scores, highScore, remainingTime, difficulty, numQuestions, totalScores, dispatch }}>
			{children}
		</QuizContext.Provider>
	);
}

export function useQuiz() {
	const context = useContext(QuizContext);
	if (context === undefined) throw new Error('QuizContext was used outside of the QuizProvider.');
	return context;
}
