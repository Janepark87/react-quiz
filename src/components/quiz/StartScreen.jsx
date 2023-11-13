import SelectEntryLevel from './SelectEntryLevel';

export default function StartScreen({ numQuestions, dispatch, highScore, difficulty }) {
	return (
		<div className="start">
			<h2>Welcome to The React Quiz!</h2>
			<h3>{numQuestions} questions to test your React mastery</h3>

			<span className="outline-rounded highscore">Hight Score: {highScore}</span>

			<SelectEntryLevel dispatch={dispatch} difficulty={difficulty} />

			<button className="btn" onClick={() => dispatch({ type: 'start' })}>
				Let's start
			</button>
		</div>
	);
}
