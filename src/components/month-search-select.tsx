import { formatMonth, minDate, maxDate } from '../date-utils';

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

function MonthSearchSelect({ show }: { show: string }) {
	return (
		<select class="select select-lg" name="month" data-show={show} data-bind="_monthSearch">
			{months.map((month) => (
				<option key={month.id} value={month.id}>
					{month.name}
				</option>
			))}
		</select>
	);
}

export { MonthSearchSelect };
