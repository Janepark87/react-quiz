import { useEffect } from 'react';
import { useQuiz } from '../../contexts/QuizContext';

export default function Timer() {
	const { dispatch, remainingTime } = useQuiz();

	const mins = String(Math.floor(remainingTime / 60)).padStart(2, '0');
	const seconds = String(remainingTime % 60).padStart(2, '0');

	useEffect(() => {
		const interval = setInterval(() => dispatch({ type: 'timer' }), 1000);

		return () => clearInterval(interval);
	}, [dispatch]);

	return (
		<span className="outline-rounded">
			{mins} : {seconds}
		</span>
	);
}
