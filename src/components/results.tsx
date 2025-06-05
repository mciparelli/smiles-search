import Flight from './flight';

export function Results({ flights }) {
	return (
		<div id="results-wrapper" class="overflow-x-auto border border-gray-900" data-scroll-into-view__smooth__vstart__hstart="">
			<table class="table table-lg table-pin-cols text-center">
				<thead>
					<tr class="text-xl [&>th]:bg-primary text-primary-content font-medium">
						<th>Tramo</th>
						<th>Fecha y hora</th>
						<th class="lg:hidden">Millas</th>
						<th>Aerolínea</th>
						<th>Cabina</th>
						<th>Escalas</th>
						<th>Duración</th>
						<th>Asientos</th>
						<th class="hidden lg:table-cell">Millas</th>
					</tr>
				</thead>
				<tbody>
					{flights.map((flight, i) => {
						return <Flight key={flight.uid} flight={flight} />;
					})}
				</tbody>
			</table>
		</div>
	);
}
