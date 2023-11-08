import { signal, useSignal } from "@preact/signals";
import { formatFlightDateLong, formatFlightDateShort } from "utils/dates.js";
import {
  filterFlights,
  filtros,
  getLink,
  sortByMilesAndTaxes,
} from "utils/flight.js";
import {
  abortControllersSignal,
  requestsSignal,
  resultadosSignal,
} from "utils/signals.js";
import MainForm from "./main-form.jsx";
import Filters from "./filters.jsx";
import Spinner from "components/spinner.jsx";
import Flight from "components/flight.jsx";
import { CheckIcon } from "icons";
import Regions from "components/regions.jsx";
import { regionsSignal } from "utils/signals.js";

export default function FormAndResults({ flights, filtered, params }) {
  const filtersSignal = useSignal({
    filtered,
    filters: {
      "canje[id]": filtros.defaults.canje.id,
    }
  })
  const isMonthSearch = !params.departureDate;
  const canjeId = filtros.defaults.canje.id;
  const canje = filtros.canje.find((someCanje) => someCanje.id === canjeId);
  return (
    <div class="p-4 gap-4 flex flex-col flex-grow-[1]">
      <Regions />
      <MainForm
        params={params}
        initialMonthSearch={isMonthSearch}
      />
      {flights?.length > 0 && (
        <Filters
          onChange={(newFilters) => {
            filtersSignal.value = {
              ...filtersSignal.value,
              filters: newFilters,
              filtered: filterFlights({
                allFlights: flights,
                monthSearch: isMonthSearch,
                filters: newFilters,
              }),
            };
          }}
        />
      )}
      {!flights &&
        (
          <p class="m-auto">
            Elija un origen, un destino y una fecha para buscar.
          </p>
        )}
      {/*Boolean(requestsSignal.value.error) &&
        requestsSignal.value.status === "finished" && (
        <p class="m-auto">{requestsSignal.value.error}</p>
      )*/}
      {flights?.length === 0 && (
        <p class="m-auto">No se encontraron vuelos para este tramo.</p>
      )}
      {filtered?.length > 0 &&
        (
          <div class="max-w-[100vw] overflow-x-auto border border-gray-900">
            <table class="table-auto text-sm text-center min-w-[fit-content] w-full whitespace-nowrap">
              <thead class="font-bold text-slate-400">
                <tr>
                  <th class="py-4 bg-blue-400 px-2">Tramo</th>
                  <th class="bg-blue-400 px-2">Fecha y hora</th>
                  <th class="bg-blue-400 px-2 lg:hidden">
                    {canje.name} + Tasas
                  </th>
                  <th class="bg-blue-400 px-2">Aerolínea</th>
                  <th class="bg-blue-400 px-2">Cabina</th>
                  <th class="bg-blue-400 px-2">Escalas</th>
                  <th class="bg-blue-400 px-2">Duración</th>
                  <th class="bg-blue-400 px-2">Asientos</th>
                  <th class="bg-blue-400 px-2 hidden lg:table-cell">
                    {canje.name} + Tasas
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((flight, i) => {
                  console.log(flight.departureDate)
                  const bgColor = i % 2 === 0 ? "bg-white" : "bg-blue-200";
                  return (
                    <Flight
                      key={flight.uid}
                      bgColor={bgColor}
                      flight={flight}
                      canje={canje}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
}
