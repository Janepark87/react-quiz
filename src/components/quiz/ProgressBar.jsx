export default function ProgressBar({ index, numQuestions, answer, scores, totalScores }) {
	return (
		<div className="progress">
			<progress max={numQuestions} value={index + Number(answer !== null)}></progress>

			<span>
				Question <strong>{index + 1}</strong> / {numQuestions}
			</span>

			<span>
				<strong>{scores}</strong> / {totalScores}
			</span>
		</div>
	);
}
