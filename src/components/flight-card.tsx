import { Spinner } from './spinner';

interface FlightCardProps {
	flight: any;
	showMilesAndMoney: boolean;
}

export function FlightCard({ flight, showMilesAndMoney }: FlightCardProps) {
	return (
		<div
			class="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 overflow-hidden"
			data-on-load={`@get('/tax?uid=${flight.uid}&fareuid=${flight.fare.uid}')`}
		>
			{/* Card Header */}
			<div class="bg-gradient-to-r from-primary to-primary/80 text-primary-content p-3 sm:p-4">
				<div class="flex justify-between items-start">
					<div class="flex-1">
						<a
							class="text-lg sm:text-xl font-bold hover:underline inline-flex items-center"
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
						<div class="text-xs sm:text-sm opacity-90 mt-1">
							{new Date(flight.departureDate).toLocaleDateString('es-AR', {
								weekday: 'short',
								day: 'numeric',
								month: 'short',
								year: 'numeric',
							})}
						</div>
					</div>
					<div class="text-right">
						<div class="text-sm font-semibold bg-white/20 rounded px-2 py-1 backdrop-blur-sm">{flight.airline.name}</div>
					</div>
				</div>
			</div>

			{/* Card Body */}
			<div class="p-3 sm:p-4 space-y-3">
				{/* Flight Details */}
				<div class="grid grid-cols-2 gap-2 text-sm">
					<div>
						<span class="text-gray-500">Salida:</span>
						<div class="font-medium">
							{new Date(flight.departureDate).toLocaleTimeString('es-AR', {
								hour: '2-digit',
								minute: '2-digit',
							})}
						</div>
					</div>
					<div>
						<span class="text-gray-500">Duración:</span>
						<div class="font-medium">{flight.durationInHours}hs</div>
					</div>
					<div>
						<span class="text-gray-500">Cabina:</span>
						<div class="font-medium">{getCabinName(flight.cabin)}</div>
					</div>
					<div>
						<span class="text-gray-500">Escalas:</span>
						<div class="font-medium">{flight.stops === 0 ? 'Directo' : `${flight.stops} ${flight.stops === 1 ? 'escala' : 'escalas'}`}</div>
					</div>
				</div>

				{/* Availability */}
				<div class="text-sm text-gray-600">
					<span class="font-medium">{flight.availableSeats}</span> asientos disponibles
				</div>

				{/* Price */}
				<div class="border-t pt-3">
					<div class="flex items-baseline justify-between">
						<span class="text-sm text-gray-500">Precio:</span>
						<div class="flex items-baseline gap-2 text-lg font-bold">
							<span class="text-primary" id={`miles-${flight.uid}-${flight.fare.uid}`}>
								{new Intl.NumberFormat('es-AR').format(flight.fare.miles)}
							</span>
							{showMilesAndMoney && (
								<>
									<span class="text-gray-400">+</span>
									<span class="text-green-600" id={`miles-and-money-${flight.uid}-${flight.fare.uid}`}>
										${Math.floor(flight.fare.money / 1000)}K
									</span>
								</>
							)}
							<span class="text-gray-400">+</span>
							<div id={`tax-${flight.uid}-${flight.fare.uid}`} class="text-gray-700">
								<Spinner size="small" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
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
