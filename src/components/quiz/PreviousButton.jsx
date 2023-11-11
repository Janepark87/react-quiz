export default function PreviousButton({ dispatch, index }) {
	if (index === 0) return;

	return (
		<button className="btn float-left" onClick={() => dispatch({ type: 'prevQuestion' })}>
			Previous
		</button>
	);
}
