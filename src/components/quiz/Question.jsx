import { useQuiz } from '../../contexts/QuizContext';
import Options from './Options';

export default function Question() {
	const { index, filterQuestions } = useQuiz();
	const question = filterQuestions.at(index);

	return (
		<div>
			<h4>{question.question}</h4>
			<Options question={question} />
		</div>
	);
}
