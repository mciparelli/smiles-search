function isRegionValid(someRegion) {
	return someRegion && someRegion.region_name && someRegion.airports?.some((someAirport) => someAirport.length === 3);
}

function getRegionValidAirports(someRegion) {
	return someRegion.airports?.filter((someAirport) => someAirport.length === 3);
}

function populateDefaultRegions() {
	localStorage.setItem(
		'regions',
		JSON.stringify({
			region1: { region_name: 'SAMERICA', airports: ['SCL', 'LIM', 'BOG', 'BUE', 'MVD', 'ASU', 'UIO'] },
			region2: { region_name: 'LIMITROFE', airports: ['SCL', 'MVD', 'ASU', 'SAO', 'RIO'] },
			region3: { region_name: 'ARGENTINA', airports: ['BUE', 'COR', 'ROS', 'MDZ', 'NQN', 'BRC', 'IGR'] },
			region4: { region_name: 'BRASIL', airports: ['RIO', 'SAO', 'FLN', 'MCZ', 'SSA', 'REC', 'NAT', 'IGU'] },
			region5: { region_name: 'COLOMBIA', airports: ['BOG', 'ADZ', 'CTG', 'SMR'] },
			region6: { region_name: 'CARIBE', airports: ['CUN', 'PTY', 'PUJ', 'SJO', 'AUA', 'HAV', 'CTG', 'SJU'] },
			region7: { region_name: 'NAMERICA', airports: ['MEX', 'CHI', 'NYC', 'LAX', 'DFW', 'SFO', 'LAS'] },
			region8: { region_name: 'USAESTE', airports: ['NYC', 'WAS', 'PHL', 'BOS', 'DTT', 'CHI'] },
			region9: { region_name: 'USAOESTE', airports: ['LAX', 'HNL', 'SFO', 'LAS', 'SAN', 'SMF'] },
			region10: { region_name: 'USASUR', airports: ['DFW', 'PHX', 'IAH', 'SAT', 'ATL'] },
			region11: { region_name: 'FLORIDA', airports: ['MIA', 'FLL', 'MCO', 'TPA'] },
			region12: { region_name: 'HAWAII', airports: ['HNL', 'LIH', 'KOA', 'OGG'] },
			region13: { region_name: 'CANADA', airports: ['YTO', 'YMQ', 'YVR', 'YOW', 'YQB'] },
			region14: { region_name: 'EUROPA', airports: ['LIS', 'MAD', 'BCN', 'PAR', 'AMS', 'ROM', 'LON', 'FRA', 'IST'] },
			region15: { region_name: 'CEUROPA', airports: ['BRU', 'ATH', 'BER', 'ZRH', 'VIE', 'PRG'] },
			region16: {
				region_name: 'ESPANA',
				airports: ['MAD', 'BCN', 'VLC', 'PMI', 'AGP', 'IBZ', 'SVQ', 'BIO'],
			},
			region17: { region_name: 'ITALIA', airports: ['ROM', 'MIL', 'BLQ', 'VCE', 'NAP'] },
			region18: { region_name: 'FRANCIA', airports: ['PAR', 'MRS', 'NCE', 'LYS', 'NTE', 'TLS'] },
			region19: { region_name: 'NORDICO', airports: ['CPH', 'HEL', 'STO', 'OSL', 'BGO', 'SVG', 'GOT'] },
			region20: {
				region_name: 'ASIA',
				airports: ['DXB', 'BKK', 'TLV', 'TYO', 'SEL', 'DPS'],
			},
			region21: { region_name: 'MORIENTE', airports: ['IST', 'CAI', 'DXB', 'TLV', 'DOH'] },
			region22: { region_name: 'SASIA', airports: ['BKK', 'SIN', 'MLE', 'DPS', 'SGN', 'KUL'] },
			region23: { region_name: 'NASIA', airports: ['TYO', 'SEL', 'HKG'] },
			region24: { region_name: 'INDIA', airports: ['DEL', 'BLR', 'BOM', 'CCU', 'JAI'] },
			region25: { region_name: 'AFRICA', airports: ['CAI', 'SEZ', 'CPT', 'DAR', 'ADD', 'RBA'] },
			region26: {
				region_name: 'OCEANIA',
				airports: ['AKL', 'SYD', 'MEL'],
			},
		}),
	);
}

function updateRegionsSelectOptions() {
	let allRegions = Object.values(JSON.parse(localStorage.getItem('regions')));
	let regions = allRegions.filter(isRegionValid);
	let regionNames = regions.map((region) => region.region_name);
	let regionsSelect = document.querySelectorAll('[name=region_from],[name=region_to]');
	for (const regionSelect of regionsSelect.values()) {
		let desdeOrHacia = regionSelect.name === 'region_to' ? 'Hacia' : 'Desde';
		regionSelect.innerHTML = `<option selected value="">${desdeOrHacia}</option>`;
		for (let regionName of regionNames) {
			let option = document.createElement('option');
			option.value = regionName;
			option.textContent = desdeOrHacia + ': ' + regionName;
			regionSelect.appendChild(option);
		}
	}
}

// needed because regions are populated by JS script
function selectStorageRegions() {
	let dataStarData = localStorage.getItem('datastar');
	if (dataStarData) {
		let data = JSON.parse(dataStarData);
		document.querySelector('[name=region_from]').value = data._regionFrom;
		document.querySelector('[name=region_to]').value = data._regionTo;
	}
}

function handleDestinationFocus() {
	let el = document.querySelector('[name=destinationAirportCode]');
	let isVisible = el.style.display !== 'none';
	let isEmpty = el.value === '';
	if (isVisible && isEmpty) {
		el.focus();
	}
}

/* airport and region in caps */
document.addEventListener('input', function (event) {
	if (event.target.matches('[name=airport_name]') || event.target.matches('[name=region_name]') || event.target.matches('.input-airport')) {
		event.target.value = event.target.value.toUpperCase();
	}
});

/* save to storage */
document.addEventListener('change', function (ev) {
	if (!event.target.closest('form.region')) return;
	let regionForms = document.querySelectorAll('form.region');
	let i = 1;
	let jsonToStore = {};
	for (let someForm of regionForms) {
		let airports = [];
		for (let airport of someForm.elements.airport_name) {
			airports = [...airports, airport.value];
		}
		jsonToStore['region' + i++] = { region_name: someForm.elements.region_name.value, airports };
	}
	localStorage.setItem('regions', JSON.stringify(jsonToStore));
	updateRegionsSelectOptions();
});
/* restore from storage on page load */
window.addEventListener('load', function () {
	try {
		let regions = JSON.parse(localStorage.getItem('regions') ?? {});
		let hasRegionsStored = regions && isRegionValid(Object.values(regions)[0]);
		if (!hasRegionsStored) {
			populateDefaultRegions();
			regions = JSON.parse(localStorage.getItem('regions') ?? {});
		}
		let form = document.querySelector('form.region');
		let i = 1;
		for (let region in regions) {
			let regionData = regions[region];
			let newEl = form.cloneNode(true);
			newEl.name = 'region' + i++;
			newEl.elements.region_name.value = regionData.region_name;
			for (let j = 0; j < 10; j++) {
				newEl.elements.airport_name[j].value = regionData.airports[j] ?? '';
			}
			form.insertAdjacentElement('beforebegin', newEl);
		}
		if (hasRegionsStored) {
			form.remove();
		}
		updateRegionsSelectOptions();
		selectStorageRegions();
		handleDestinationFocus();
		document.querySelector('[name=region_from]').classList.remove('cloak');
		document.querySelector('[name=region_to]').classList.remove('cloak');
	} catch (err) {
		populateDefaultRegions();
	}
});

const minDate = new Date();
const maxDate = new Date();
maxDate.setDate(maxDate.getDate() + 329);

function findDatesInMonth(monthString) {
	let [year, month] = monthString.split('-').map(Number);
	let daysInMonth = new Date(year, month, 0).getDate();
	let dates = [];
	for (let day = 1; day <= daysInMonth; day++) {
		let date = new Date(year, month - 1, day);
		if (date >= minDate && date <= maxDate) {
			dates.push(date.toISOString().split('T')[0]);
		}
	}
	return dates;
}

function computeDestination({ destinationAirport, destinationRegion, searchType }) {
	if (!destinationRegion || !['from-airport-to-region', 'from-region-to-region'].includes(searchType)) return [destinationAirport];
	let regions = Object.values(JSON.parse(localStorage.getItem('regions') ?? {}));
	if (!isRegionValid(regions[0])) return [destinationAirport];
	let region = regions.find((someRegion) => someRegion.region_name === destinationRegion);
	let airports = getRegionValidAirports(region);
	if (airports.length === 0) return [destinationAirport];
	return airports;
}

function computeOrigin({ originAirport, originRegion, searchType }) {
	if (!originRegion || !['from-region-to-airport', 'from-region-to-region'].includes(searchType)) return [originAirport];
	let regions = Object.values(JSON.parse(localStorage.getItem('regions') ?? {}));
	if (!isRegionValid(regions[0])) return [originAirport];
	let region = regions.find((someRegion) => someRegion.region_name === originRegion);
	let airports = getRegionValidAirports(region);
	if (airports.length === 0) return [originAirport];
	return airports;
}

function computeDate({ dateSearch, monthSearch, isMonthSearch }) {
	if (!isMonthSearch) return [dateSearch];
	return findDatesInMonth(monthSearch);
}

function generateParams(form) {
	let formData = new FormData(form);
	let data = Object.fromEntries(formData);
	let origin = [data.originAirportCode];
	let destination = [data.destinationAirportCode];
	let date = [data.departureDate];
	if (data.is_month_search === 'on') {
		date = findDatesInMonth(data.month);
	}
	if (data.region_from && ['from-region-to-airport', 'from-region-to-region'].includes(data.search_type)) {
		let regions = Object.values(JSON.parse(localStorage.getItem('regions') ?? {}));
		let region = regions.find((someRegion) => someRegion.region_name === data.region_from);
		let airports = getRegionValidAirports(region);
		if (airports.length > 0) {
			origin = airports;
		}
	}
	if (data.region_to && ['from-airport-to-region', 'from-region-to-region'].includes(data.search_type)) {
		let regions = Object.values(JSON.parse(localStorage.getItem('regions') ?? {}));
		let region = regions.find((someRegion) => someRegion.region_name === data.region_to);
		let airports = getRegionValidAirports(region);
		if (airports.length > 0) {
			destination = airports;
		}
	}
	return { origin, destination, date };
}

function showTotalFiltersApplied({ airlines, cabina, escalas }) {
	let i = 0;
	if (airlines.filter(Boolean).length > 0) {
		i += 1;
	}
	if (cabina !== 'all') {
		i += 1;
	}
	if (escalas !== '') {
		i += 1;
	}
	if (i === 0) return '';
	return `(${i})`;
}
