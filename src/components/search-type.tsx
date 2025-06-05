const searchTypes = [
	{ id: 'airports', name: 'Aeropuertos y ciudades' },
	{ id: 'from-airport-to-region', name: 'De aeropuerto a región' },
	{ id: 'from-region-to-airport', name: 'De región a aeropuerto' },
	{ id: 'from-region-to-region', name: 'De región a región' },
];

function SearchType() {
	return (
		<select aria-label="Tipo de búsqueda" name="search_type" class="select select-lg w-[clamp(3rem,25rem,100%)]" data-bind="_searchType">
			{searchTypes.map((someType) => (
				<option key={someType.id} value={someType.id}>
					Tipo de búsqueda: {someType.name}
				</option>
			))}
		</select>
	);
}

export { SearchType };
