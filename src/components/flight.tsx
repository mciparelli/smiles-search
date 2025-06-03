import { Spinner } from './spinner.jsx';
import { fares, filtros, getLink } from '../flight-utils.js';
import { formatFlightDateLong, formatFlightDateShort } from '../date-utils.js';

function Tax({ data, error, isLoading }) {
	return (
		<>
			{isLoading && <Spinner />}
			{data && `$${Math.floor(data.money / 1000)}K`}
			{!isLoading && !data && error && '?'}
		</>
	);
}

export default function Flight({ flight }) {
	let taxInfo = {};
	const milesDisplay = (
		<>
			{new Intl.NumberFormat('es-AR').format(flight.fare.miles)}
			{false === fares.moneyClub && flight.fare.money && ` + $${Math.floor(flight.fare.money / 1000)}K`}
		</>
	);
	return (
		<tr class="even:bg-primary/25">
			<td>
				<a class="text-blue-500" target="_blank" href={getLink(flight)}>
					{flight.origin}-{flight.destination}
				</a>
			</td>
			<td class="md:hidden">{formatFlightDateShort(new Date(flight.departureDate))}</td>
			<td class="hidden md:table-cell">{formatFlightDateLong(new Date(flight.departureDate))}</td>
			<td class="lg:hidden">
				<div class="inline-flex">{milesDisplay} +</div>
			</td>
			<td>{flight.airline.name}</td>
			<td>{filtros.cabinas.find((someCabina) => someCabina.id === flight.cabin).name}</td>
			<td>{flight.stops || 'Directo'}</td>
			<td>{flight.durationInHours}hs</td>
			<td>{flight.availableSeats}</td>
			<td class="hidden lg:table-cell">
				<div class="inline-flex">{milesDisplay}</div>
			</td>
		</tr>
	);
}
