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
import { filtros } from "utils/flight.js";
import { findFlightsForDate, findFlightsInMonth } from "api";
import MonthSearchSwitch from "components/month-search-switch.jsx";
import MonthsDropdown from "components/months-dropdown.jsx";
import { InformationCircleIcon } from "icons";
import { concurrencySignal } from "utils/signals.js";

function ConsultasEnSimultaneo({ class: className = "" }) {
  return (
    <label
      title="Un número de consultas en simultáneo demasiado alto podría causar un bloqueo temporario por parte de Smiles. Un número de consultas en simultáneo demasiado bajo podría causar mayores demoras en las búsquedas, especialmente en búsquedas por regiones."
      class={`flex ml-auto gap-2 items-center ${className}`}
    >
      <InformationCircleIcon class="w-5" />Consultas en simultáneo<input
        type="number"
        name="concurrency"
        value={String(concurrencySignal.value)}
        onChange={(ev) => {
          const newValue = Number(ev.target.value);
          if (newValue < 1 || newValue > 20) {
            concurrencySignal.value = 20;
            return;
          }
          concurrencySignal.value = newValue;
        }}
        class="w-20 shadow-md px-2 rounded-sm h-10 invalid:border invalid:border-red-400"
        max="20"
        min="1"
      />
    </label>
  );
}

export default function MainForm({ params, monthSearchSignal, onSubmit }) {
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
      <ConsultasEnSimultaneo class="sm:hidden" />
      <fieldset class="group flex gap-2 w-full">
        <input
          name="originAirportCode"
          required
          type="text"
          pattern="[a-zA-Z]{3}"
          class="shadow-md px-2 h-10 w-20 rounded-sm"
          placeholder="Desde"
          maxLength={3}
          onInput={(ev) => ev.target.value = ev.target.value.toUpperCase()}
          value={params.originAirportCode ?? filtros.defaults.originAirportCode}
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
        <ConsultasEnSimultaneo class="hidden sm:flex" />
      </fieldset>
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
      <button
        type="submit"
        class="h-10 shadow-md disabled:opacity-25 bg-blue-700 text-white rounded-sm px-4"
      >
        Buscar
      </button>
    </form>
  );
}
