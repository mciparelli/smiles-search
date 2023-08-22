import { Switch } from "@headlessui/react";
import Dropdown from "components/dropdown.jsx";
import { useSignal } from "@preact/signals";
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

export default function MainForm({ params, onSubmit }) {
  const monthSearch = useSignal(!params.departureDate);
  return (
    <form
      class="flex flex-col gap-4 items-start"
      method="get"
      onSubmit={async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const searchParams = Object.fromEntries(formData.entries());
        onSubmit(searchParams);
      }}
    >
      <fieldset class="group flex gap-2">
        <input
          name="originAirportCode"
          required
          type="text"
          pattern="[a-zA-Z]{3}"
          class="shadow-md px-2 h-10 w-20 rounded-sm"
          placeholder="Desde"
          maxLength={3}
          onInput={(ev) => ev.target.value = ev.target.value.toUpperCase()}
          value={params.originAirportCode ?? "BUE"}
        />
        <input
          name="destinationAirportCode"
          required
          type="text"
          pattern="[a-zA-Z]{3}"
          class="shadow-md px-2 h-10 w-20 rounded-sm"
          placeholder="Hacia"
          maxLength={3}
          onInput={(ev) => ev.target.value = ev.target.value.toUpperCase()}
          value={params.destinationAirportCode}
          autoFocus
        />
      </fieldset>
      <fieldset class="flex flex-col gap-2 my-2">
        <MonthSearchSwitch signal={monthSearch} />
        {monthSearch.value
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
      <button
        type="submit"
        class="h-10 shadow-md disabled:opacity-25 bg-blue-700 text-white rounded-sm px-4"
      >
        Buscar
      </button>
    </form>
  );
}
