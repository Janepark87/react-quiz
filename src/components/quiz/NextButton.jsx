export default function NextButton({ dispatch, answer, index, numQuestions }) {
	if (answer == null) return null;
	const isLastQuestion = index + 1 === numQuestions;

	return (
		<button className="btn float-right" onClick={() => dispatch({ type: isLastQuestion ? 'finishQuiz' : 'nextQuestion' })}>
			{isLastQuestion ? 'Finish Quiz' : 'Next'}
		</button>
	);
}
