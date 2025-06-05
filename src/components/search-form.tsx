import { filtros } from 'src/flight-utils';
import { Collapsible } from './collapsible';
import { DateSearch } from './date-search';
import { Filters } from './filters';
import { MonthSearchSelect } from './month-search-select';
import { SearchType } from './search-type';

function SearchForm() {
	let maxDate = new Date();
	maxDate.setDate(maxDate.getDate() + 329);

	return (
		<form
			name="search"
			class="flex flex-col gap-4 items-start group"
			data-signals={`{airline: [], escalas: '${filtros.defaults.escalas.id}', cabina: '${filtros.defaults.cabina.id}' }`}
			data-on-submit="if ($requestController) { $requestController.abort('Request in flight');} $requestController = new AbortController(); @post('/search', { abort: $requestController.signal })"
		>
			<SearchType />
			<fieldset class="group flex gap-2 w-full items-baseline">
				<select
					class="select select-lg cloak"
					aria-label="Region: desde"
					name="region_from"
					data-bind="_regionFrom"
					data-show="['from-region-to-region', 'from-region-to-airport'].includes($_searchType)"
					data-attr-required="['from-region-to-region', 'from-region-to-airport'].includes($_searchType)"
				>
					<option disabled selected value="">
						Desde
					</option>
				</select>
				<input
					data-bind="_originAirportCode"
					data-show="['from-airport-to-region', 'airports'].includes($_searchType)"
					name="originAirportCode"
					data-attr-required="['from-airport-to-region', 'airports'].includes($_searchType)"
					type="text"
					pattern="[a-zA-Z]{3}"
					class="input input-airport input-lg"
					placeholder="Desde"
					maxLength={3}
					value="EZE"
				/>
				<input
					data-bind="_destinationAirportCode"
					data-show="['from-region-to-airport', 'airports'].includes($_searchType)"
					name="destinationAirportCode"
					data-attr-required="['from-region-to-airport', 'airports'].includes($_searchType)"
					type="text"
					pattern="[a-zA-Z]{3}"
					class="input input-airport input-lg"
					placeholder="Hacia"
					maxLength={3}
				/>
				<select
					class="select select-lg cloak"
					aria-label="Region: hacia"
					name="region_to"
					data-bind="_regionTo"
					data-attr-required="['from-airport-to-region', 'from-region-to-region'].includes($_searchType)"
					data-show="['from-airport-to-region', 'from-region-to-region'].includes($_searchType)"
				>
					<option disabled selected value="">
						Hacia
					</option>
				</select>
				{/* <button
					type="button"
					class="px-2 switch-airports-or-regions"
					data-on-click="switchAirportsOrRegions($_searchType)"
					data-show="['airports', 'from-region-to-region'].includes($_searchType)"
				>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="h-5 w-5">
						<path
							fill-rule="evenodd"
							d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z"
							clip-rule="evenodd"
						/>
					</svg>
				</button> */}
			</fieldset>
			<fieldset class="flex flex-col md:flex-row gap-4 lg:gap-8">
				<label class="label text-base-content font-medium">
					Búsqueda por mes
					<input
						type="checkbox"
						name="is_month_search"
						class="toggle toggle-xl toggle-primary transition-opacity cloak"
						data-class="{cloak:false}"
						data-bind="_isMonthSearch"
						checked={true}
					/>
				</label>
				<MonthSearchSelect maxDate={maxDate} show="$_isMonthSearch" />
				<DateSearch maxDate={maxDate} show="!$_isMonthSearch" />
			</fieldset>
			<fieldset class="flex flex-col md:flex-row gap-4 lg:gap-8">
				<label class="label text-base-content font-medium">
					Sólo vuelos award
					<input
						type="checkbox"
						name="award"
						class="toggle toggle-xl toggle-primary transition-opacity cloak"
						data-class="{cloak:false}"
						data-bind="award"
						checked={true}
					/>
				</label>
				{/* <label class="label text-neutral">
					Smiles & Money
					<input
						type="checkbox"
						name="smiles_and_money"
						class="toggle toggle-xl checked:bg-primary checked:text-primary-content transition-opacity cloak"
						data-class="{cloak:false}"
						data-bind="smilesAndMoney"
					/>
				</label> */}
				<label class="label text-base-content font-medium">
					Sólo vuelos de GOL (Brasil)
					<input
						type="checkbox"
						name="solo_gol"
						class="toggle toggle-xl toggle-primary transition-opacity cloak"
						data-class="{cloak:false}"
						data-bind="onlyGol"
					/>
				</label>
				{/* <label class="label text-neutral">
					Sólo viaje fácil
					<input
						type="checkbox"
						name="viaje_facil"
						class="toggle toggle-xl checked:bg-primary checked:text-primary-content transition-opacity cloak"
						data-class="{cloak:false}"
						data-bind="viajeFacil"
					/>
				</label> */}
			</fieldset>
			<Collapsible
				title={
					<span>
						Filtros <span data-text="showTotalFiltersApplied({ airlines: $airline, escalas: $escalas, cabina: $cabina })" />
					</span>
				}
				containerClass="border bg-base-200 text-base-content overflow-visible"
				class="p-4 gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3"
			>
				<Filters />
			</Collapsible>
			<button
				type="submit"
				class="btn btn-primary btn-lg text-primary-content group-invalid:opacity-50 group-invalid:cursor-not-allowed"
				data-computed-origin="computeOrigin({ originAirport: $_originAirportCode, originRegion: $_regionFrom, searchType: $_searchType })"
				data-computed-destination="computeDestination({ destinationAirport: $_destinationAirportCode, destinationRegion: $_regionTo, searchType: $_searchType })"
				data-computed-date="computeDate({ dateSearch: $_dateSearch, monthSearch: $_monthSearch, isMonthSearch: $_isMonthSearch })"
				data-persist="_dateSearch _monthSearch _isMonthSearch _searchType _regionFrom _regionTo _originAirportCode _destinationAirportCode escalas viajeFacil award onlyGol smilesAndMoney"
			>
				Buscar
			</button>
		</form>
	);
}

export { SearchForm };
