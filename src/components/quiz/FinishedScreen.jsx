import { useQuiz } from '../../contexts/QuizContext';

export default function FinishedScreen() {
	const { scores, totalScores, highScore, dispatch } = useQuiz();

	const percentage = (scores / totalScores) * 100;
	let emoji;
	if (percentage === 100) emoji = '🥇';
	if (percentage >= 80 && percentage < 100) emoji = '🎉';
	if (percentage >= 50 && percentage < 80) emoji = '👏';
	if (percentage >= 0 && percentage < 50) emoji = '🙈';
	if (percentage === 0) emoji = '🫣';

	return (
		<>
			<p className="result">
				<span>{emoji}</span>
				You scored <strong>{scores}</strong> out of {totalScores} ({Math.ceil(percentage)}%)
			</p>

			<p className="highscore">
				{highScore <= scores && highScore !== 0 ? 'New' : ''} High Score: {highScore} points
			</p>

			<button className="btn mx-auto" onClick={() => dispatch({ type: 'restart' })}>
				Restart Quiz
			</button>
		</>
	);
}
