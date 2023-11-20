import { useQuiz } from '../../contexts/QuizContext';

export default function Exit() {
	const { dispatch } = useQuiz();

	return (
		<button className="btn" onClick={() => dispatch({ type: 'restart' })}>
			Exit
		</button>
	);
}
