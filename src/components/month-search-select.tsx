import { formatMonth } from '../date-utils';

function generateMonths(maxDate) {
	let months = [];
	const today = new Date();
	for (let i = 0; i <= 11; i++) {
		const date = new Date(today);
		date.setDate(1);
		date.setMonth(date.getMonth() + i);
		if (date <= maxDate) {
			months = [
				...months,
				{
					id: formatMonth(date),
					name: date.toLocaleString('es-AR', {
						year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
						month: 'long',
					}),
				},
			];
		}
	}
	return months;
}
function MonthSearchSelect({ maxDate, show }: { maxDate: Date; show: string }) {
	return (
		<select class="select select-lg" name="month" data-show={show} data-bind="_monthSearch">
			{generateMonths(maxDate).map((month) => (
				<option key={month.id} value={month.id}>
					{month.name}
				</option>
			))}
		</select>
	);
}

export { MonthSearchSelect };
