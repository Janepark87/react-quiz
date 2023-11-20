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
import { useQuiz } from './contexts/QuizContext';

export default function App() {
	const { status } = useQuiz();

	return (
		<div className="app">
			<Header />
			<Main>
				{status === 'loading' && <Loader />}
				{status === 'error' && <Error />}
				{status === 'ready' && <StartScreen />}

				{status === 'active' && (
					<>
						<ProgressBar />

						<Question />

						<ButtonGroup>
							<PreviousButton />
							<NextButton />
						</ButtonGroup>

						<ButtonGroup className="footer">
							<Exit />
							<Timer />
						</ButtonGroup>
					</>
				)}

				{status === 'finished' && <FinishedScreen />}
			</Main>
		</div>
	);
}
