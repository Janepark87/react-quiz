export default function Exit({ dispatch }) {
	return (
		<button className="btn" onClick={() => dispatch({ type: 'restart' })}>
			Exit
		</button>
	);
}
