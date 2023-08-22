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
  filtered = sortByMilesAndTaxes(filtered);
  filtered = filtered.slice(0, filtros.defaults.results);
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
      {flights === null && !isLoading &&
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
      {flights?.length === 0 && (
        <p class="m-auto">No se encontraron vuelos para este tramo.</p>
      )}
      {flights?.length > 0 && !isLoading &&
        (
          <table class="border-collapse border border-gray-900 table-auto w-full text-sm text-center">
            <thead class="font-bold text-slate-400">
              <tr class="border-b bg-blue-400 sticky top-0 z-[-1]">
                <th class="py-4">Tramo</th>
                <th>Fecha y hora</th>
                <th>Aerolínea</th>
                <th>Cabina</th>
                <th>Escalas</th>
                <th>Duración</th>
                <th>Asientos</th>
                <th>Millas</th>
                <th>Tasas</th>
              </tr>
            </thead>
            <tbody>
              {flights.map((flight, i) => {
                return (
                  <tr
                    class={`${
                      i % 2 === 0 ? "bg-white" : "bg-blue-200"
                    } text-slate-500`}
                    key={flight.uid}
                  >
                    <td class="py-4">
                      <a
                        class="text-blue-500"
                        target="_blank"
                        href={getLink(flight)}
                      >
                        {flight.origin}-{flight.destination}
                      </a>
                    </td>
                    <td>{formatFlightDate(flight.departureDate)}</td>
                    <td>{flight.airline.name}</td>
                    <td>
                      {filtros.cabinas.find((someCabina) =>
                        someCabina.id === flight.cabin
                      ).name}
                    </td>
                    <td>{flight.stops || "Directo"}</td>
                    <td>{flight.durationInHours}hs</td>
                    <td>{flight.availableSeats}</td>
                    <td>
                      {new Intl.NumberFormat("es-AR").format(flight.fare.miles)}
                    </td>
                    <td>${Math.floor(flight.fare.tax.money / 1000)}K</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
    </div>
  );
}
