import { FlightCard } from './flight-card';
import { Spinner } from './spinner';

interface ResultsProps {
	flights: any[];
	showMilesAndMoney: boolean;
}

export function Results({ flights, showMilesAndMoney }: ResultsProps) {
	return (
		<div id="results-wrapper" class="w-full" data-scroll-into-view__smooth__vstart__hstart="">
			{/* Card-based layout for mobile and tablet */}
			<div class="xl:hidden grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
				{flights.map((flight) => (
					<FlightCard key={`${flight.uid}-${flight.fare.uid}`} flight={flight} showMilesAndMoney={showMilesAndMoney} />
				))}
			</div>

			{/* Table view for desktop */}
			<div class="hidden xl:block overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
				<table class="table table-lg table-pin-cols text-center">
					<thead>
						<tr class="text-base [&>th]:bg-primary text-primary-content font-medium">
							<th class="px-3 py-3">Tramo</th>
							<th class="px-3 py-3">Fecha y hora</th>
							<th class="px-3 py-3">Aerolínea</th>
							<th class="px-3 py-3">Cabina</th>
							<th class="px-3 py-3">Escalas</th>
							<th class="px-3 py-3">Duración</th>
							<th class="px-3 py-3">Asientos</th>
							<th class="px-3 py-3">{showMilesAndMoney ? 'Millas + Money + Tasas' : 'Millas + Tasas'}</th>
						</tr>
					</thead>
					<tbody>
						{flights.map((flight) => (
							<FlightTableRow key={`${flight.uid}-${flight.fare.uid}`} flight={flight} showMilesAndMoney={showMilesAndMoney} />
						))}
					</tbody>
				</table>
			</div>

			{/* Empty state */}
			{flights.length === 0 && (
				<div class="text-center py-12">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-16 w-16 mx-auto text-gray-400 mb-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<p class="text-gray-500">No se encontraron vuelos para esta búsqueda</p>
				</div>
			)}
		</div>
	);
}

// Table row component
function FlightTableRow({ flight, showMilesAndMoney }: { flight: any; showMilesAndMoney: boolean }) {
	return (
		<tr class="hover:bg-base-200/70 border-b border-gray-100" data-on-load={`@get('/tax?uid=${flight.uid}&fareuid=${flight.fare.uid}')`}>
			<td class="py-3">
				<a
					class="font-medium text-primary hover:underline inline-flex items-center"
					target="_blank"
					rel="noreferrer"
					href={getLink(flight)}
				>
					<span>
						{flight.origin}-{flight.destination}
					</span>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
						/>
					</svg>
				</a>
			</td>
			<td class="py-3">
				{new Date(flight.departureDate).toLocaleDateString('es-AR', {
					weekday: 'short',
					day: 'numeric',
					month: 'short',
					year: 'numeric',
					hour: '2-digit',
					minute: '2-digit',
				})}
			</td>
			<td class="py-3">
				<span class="font-medium">{flight.airline.name}</span>
			</td>
			<td class="py-3">{getCabinName(flight.cabin)}</td>
			<td class="py-3">{flight.stops === 0 ? 'Directo' : `${flight.stops} ${flight.stops === 1 ? 'escala' : 'escalas'}`}</td>
			<td class="py-3">{flight.durationInHours}hs</td>
			<td class="py-3">{flight.availableSeats}</td>
			<td class="py-3">
				<div class="flex gap-2 justify-center font-bold text-primary">
					<span id={`miles-${flight.uid}-${flight.fare.uid}`}>{new Intl.NumberFormat('es-AR').format(flight.fare.miles)}</span>
					{showMilesAndMoney && (
						<>
							+
							<span id={`miles-and-money-${flight.uid}-${flight.fare.uid}`} class="text-green-600">
								${Math.floor(flight.fare.money / 1000)}K
							</span>
						</>
					)}
					+
					<div id={`tax-${flight.uid}-${flight.fare.uid}`}>
						<Spinner size="small" />
					</div>
				</div>
			</td>
		</tr>
	);
}

// Helper functions
function getLink(flight: any) {
	const params = new URLSearchParams({
		originAirportCode: flight.origin,
		destinationAirportCode: flight.destination,
		departureDate: new Date(flight.departureDate).getTime().toString(),
		adults: '1',
		infants: '0',
		children: '0',
		cabinType: flight.cabin,
		tripType: '2', // ONE_WAY
	});
	return `https://www.smiles.com.ar/emission?${params.toString()}`;
}

function getCabinName(cabin: string): string {
	switch (cabin) {
		case 'ECONOMIC':
			return 'Económica';
		case 'PREMIUM_ECONOMIC':
			return 'Premium';
		case 'BUSINESS':
			return 'Ejecutiva';
		case 'FIRST':
			return 'Primera';
		default:
			return cabin;
	}
}
