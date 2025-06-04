import { formatDate } from '../date-utils';

function DateSearch({ maxDate, show }) {
	let today = new Date();
	return (
		<input
			data-bind="_dateSearch"
			data-show={show}
			name="departureDate"
			required
			type="date"
			class="input input-lg w-52"
			value={formatDate(today)}
			min={formatDate(today)}
			max={formatDate(maxDate)}
		/>
	);
}

export { DateSearch };
