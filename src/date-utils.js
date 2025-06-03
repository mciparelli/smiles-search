function formatDate(date) {
	return date.toISOString().split('T')[0];
}
function formatMonth(date) {
	const formattedDate = formatDate(date);
	const dateSplit = formattedDate.split('-');
	return `${dateSplit[0]}-${dateSplit[1]}`;
}

function formatFlightDateShort(flightDate) {
	return new Intl.DateTimeFormat('es-AR', {
		day: 'numeric',
		month: 'numeric',
	}).format(flightDate);
}

function formatFlightDateLong(flightDate) {
	return new Intl.DateTimeFormat('es-AR', {
		day: 'numeric',
		month: 'short',
		hour: 'numeric',
		minute: 'numeric',
		hour12: true,
		timeZoneName: 'short',
	}).format(flightDate);
}

const minDate = new Date();
const maxDate = new Date();
maxDate.setDate(maxDate.getDate() + 329);

export { formatDate, formatMonth, formatFlightDateShort, formatFlightDateLong, minDate, maxDate };
