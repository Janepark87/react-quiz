export default function SelectEntryLevel({ dispatch, difficulty }) {
	return (
		<select
			id="entryLevel"
			className="btn outline-rounded mb-10"
			value={difficulty}
			onChange={(e) => dispatch({ type: 'setDifficulty', payload: e.target.value })}>
			<option value="" disabled hidden>
				Choose your difficulty
			</option>
			<option value="all">All</option>
			<option value="easy">Easy</option>
			<option value="medium">Medium</option>
			<option value="hard">Hard</option>
		</select>
	);
}
