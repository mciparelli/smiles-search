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

export { formatDate, formatMonth, formatFlightDateShort, formatFlightDateLong };
