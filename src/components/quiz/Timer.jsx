import { useEffect } from 'react';

export default function Timer({ dispatch, remainingTime }) {
	const mins = Math.floor(remainingTime / 60);
	const seconds = remainingTime % 60;

	useEffect(() => {
		const interval = setInterval(() => dispatch({ type: 'timer' }), 1000);

		return () => clearInterval(interval);
	}, [dispatch]);

	return (
		<div className="timer">
			{mins < 10 && '0'}
			{mins} : {seconds < 10 && '0'}
			{seconds}
		</div>
	);
}
