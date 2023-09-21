import { Switch } from "@headlessui/react";
import Dropdown from "components/dropdown.jsx";
import {
  formatDate,
  formatMonth,
  maxDate,
  minDate,
  months,
  today,
} from "utils/dates.js";
import { findFlightsForDate, findFlightsInMonth } from "api";
import MonthSearchSwitch from "components/month-search-switch.jsx";
import MonthsDropdown from "components/months-dropdown.jsx";
import SearchTypeDropdown from "components/search-type-dropdown.jsx";
import OriginDestinationInputs from "components/origin-destination-inputs.jsx";
import { useSignal } from "@preact/signals";
import { filtros } from "utils/flight.js";

function DatesSelect({ initialMonthSearch, params }) {
  const monthSearchSignal = useSignal(initialMonthSearch);
  return (
    <fieldset class="flex flex-col gap-2 my-2">
      <MonthSearchSwitch signal={monthSearchSignal} />
      {monthSearchSignal.value
        ? <MonthsDropdown class="w-64" defaultValue={params["month[id]"]} />
        : (
          <input
            name="departureDate"
            required
            type="date"
            class="w-64 shadow-md px-2 inline-flex items-center rounded-sm group-valid:border-green-400 group-invalid:border-red-400 h-10"
            value={params.departureDate ?? formatDate(today)}
            min={formatDate(minDate)}
            max={formatDate(maxDate)}
          />
        )}
    </fieldset>
  );
}

export default function MainForm({ params, initialMonthSearch, onSubmit }) {
  const searchTypeSignal = useSignal(
    params["search_type[id]"] ?? filtros.defaults.searchTypes.id,
  );
  const searchType = filtros.searchTypes.find((someSearchType) =>
    someSearchType.id === searchTypeSignal.value
  );
  return (
    <form
      class="flex flex-col gap-4 items-start"
      method="get"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const searchParams = Object.fromEntries(formData.entries());
        onSubmit(searchParams);
      }}
    >
      <SearchTypeDropdown
        class="w-64"
        value={searchType}
        onChange={(selected) => searchTypeSignal.value = selected.id}
      />
      <OriginDestinationInputs
        defaults={params}
        searchType={searchTypeSignal.value}
      />
      <DatesSelect initialMonthSearch={initialMonthSearch} params={params} />
      <button
        type="submit"
        class="h-10 shadow-md disabled:opacity-25 bg-blue-700 text-white rounded-sm px-4"
      >
        Buscar
      </button>
    </form>
  );
}
