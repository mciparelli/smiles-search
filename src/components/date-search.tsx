import { formatDate, minDate, maxDate } from '../date-utils';

function DateSearch({ show }) {
	return (
		<input
			data-bind="_dateSearch"
			data-show={show}
			name="departureDate"
			required
			type="date"
			class="input input-lg w-52"
			value={formatDate(minDate)}
			min={formatDate(minDate)}
			max={formatDate(maxDate)}
		/>
	);
}

export { DateSearch };
