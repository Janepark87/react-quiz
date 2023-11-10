export default function Options({ question, answer, dispatch }) {
	const hasAnswered = answer !== null;

	return (
		<div className="options">
			{question.options.map((answerOption, index) => (
				<button
					type="button"
					key={answerOption}
					className={`btn btn-option ${index === answer ? 'answer' : ''} ${
						hasAnswered ? (index === question.correctOption ? 'correct' : 'wrong') : ''
					}`}
					disabled={hasAnswered}
					onClick={() => dispatch({ type: 'newAnswer', payload: index })}>
					{answerOption}
				</button>
			))}
		</div>
	);
}
