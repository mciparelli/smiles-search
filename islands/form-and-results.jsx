import { signal, useSignal } from "@preact/signals";
import { formatFlightDate } from "utils/dates.js";
import {
  filterFlights,
  filtros,
  getLink,
  sortByMilesAndTaxes,
} from "utils/flight.js";
import { apiPath, findFlightsForDate, findFlightsInMonth } from "api";
import MainForm from "./main-form.jsx";
import Filters from "./filters.jsx";
import Spinner from "components/spinner.jsx";

const flightsSignal = signal({ status: "not initiated", data: null });

async function onSubmit(searchParams) {
  const shouldFetch = searchParams.originAirportCode &&
    searchParams.destinationAirportCode;
  if (!shouldFetch) return null;
  flightsSignal.value = { status: "loading", data: null };
  const urlParams = new URLSearchParams(searchParams);
  history.replaceState(null, "", "?" + urlParams.toString());
  let flights = null;
  const month = searchParams["month[id]"];
  const monthSearch = Boolean(month);
  if (monthSearch) {
    let monthFlights = await findFlightsInMonth({
      from: searchParams.originAirportCode,
      to: searchParams.destinationAirportCode,
      month,
    });
    flights = monthFlights;
  } else {
    flights = await findFlightsForDate({
      from: searchParams.originAirportCode,
      to: searchParams.destinationAirportCode,
      date: searchParams.departureDate,
    });
  }
  let filtered = monthSearch
    ? flights.map((dayFlights) => dayFlights?.[0]).filter(Boolean)
    : flights;
  if (filtered) {
    filtered = sortByMilesAndTaxes(filtered);
    filtered = filtered.slice(0, filtros.defaults.results);
  }
  flightsSignal.value = {
    status: "loaded",
    data: flights,
    monthSearch,
    filtered,
  };
}

export default function FormAndResults({ params }) {
  const flights = flightsSignal.value.filtered;
  const isLoading = flightsSignal.value.status === "loading";
  return (
    <div class="p-4 gap-4 flex flex-col flex-grow-[1]">
      <MainForm
        params={params}
        onSubmit={onSubmit}
      />
      {flightsSignal.value.data?.length > 0 && !isLoading && (
        <Filters
          onChange={(newFilters) => {
            flightsSignal.value = {
              ...flightsSignal.value,
              filtered: filterFlights(flightsSignal.value, newFilters),
            };
          }}
        />
      )}
      {flightsSignal.value.status === 'not initiated' && !isLoading &&
        (
          <p class="m-auto">
            Elija un origen, un destino y una fecha para buscar.
          </p>
        )}
      {isLoading && (
        <div class="m-auto flex flex-col items-center">
          <Spinner />
          <p class="my-4">Buscando resultados</p>
        </div>
      )}
      {(flights === null || flights?.length === 0) && (
        <p class="m-auto">No se encontraron vuelos para este tramo.</p>
      )}
      {flights?.length > 0 && !isLoading &&
        (
          <div class="max-w-[100vw] overflow-x-auto border border-gray-900">
            <table class="table-auto text-sm text-center min-w-[fit-content] w-full">
              <thead class="font-bold text-slate-400">
                <tr class="border-b z-[-1]">
                  <th class="py-4 bg-blue-400 sticky left-0">Tramo</th>
                  <th class="bg-blue-400">Fecha y hora</th>
                  <th class="bg-blue-400">Aerolínea</th>
                  <th class="bg-blue-400">Cabina</th>
                  <th class="bg-blue-400">Escalas</th>
                  <th class="bg-blue-400">Duración</th>
                  <th class="bg-blue-400">Asientos</th>
                  <th class="bg-blue-400">Millas</th>
                  <th class="bg-blue-400">Tasas</th>
                </tr>
              </thead>
              <tbody>
                {flights.map((flight, i) => {
                  const bgColor = i % 2 === 0 ? "bg-white" : "bg-blue-200"; 
                  return (
                    <tr
                      class="text-slate-500 whitespace-nowrap"
                      key={flight.uid}
                    >
                      <td class={`${bgColor} py-4 px-2 sticky left-0`}>
                        <a
                          class="text-blue-500"
                          target="_blank"
                          href={getLink(flight)}
                        >
                          {flight.origin}-{flight.destination}
                        </a>
                      </td>
                      <td class={`${bgColor} py-px-2`}>{formatFlightDate(flight.departureDate)}</td>
                      <td class={`${bgColor} px-2`}>{flight.airline.name}</td>
                      <td class={`${bgColor} px-2`}>
                        {filtros.cabinas.find((someCabina) =>
                          someCabina.id === flight.cabin
                        ).name}
                      </td>
                      <td class={`${bgColor} px-2`}>{flight.stops || "Directo"}</td>
                      <td class={`${bgColor} px-2`}>{flight.durationInHours}hs</td>
                      <td class={`${bgColor} px-2`}>{flight.availableSeats}</td>
                      <td class={`${bgColor} px-2`}>
                        {new Intl.NumberFormat("es-AR").format(flight.fare.miles)}
                      </td>
                      <td class={`${bgColor} px-2`}>
                        {flight.fare.airlineTax
                          ? `$${flight.fare.airlineTax}K`
                          : "?"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
}
