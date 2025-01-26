import { useQuiz } from './contexts/QuizContext';
import Header from './layouts/Header';
import Main from './layouts/Main';
import { Loader, Error, ButtonGroup, StartScreen, Question, NextButton, ProgressBar, FinishedScreen, Timer, Exit, PreviousButton } from './components';

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
