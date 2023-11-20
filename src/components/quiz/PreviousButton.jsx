import { useQuiz } from '../../contexts/QuizContext';

export default function PreviousButton() {
	const { dispatch, index } = useQuiz();

	if (index === 0) return;

	return (
		<button className="btn float-left" onClick={() => dispatch({ type: 'prevQuestion' })}>
			Previous
		</button>
	);
}
