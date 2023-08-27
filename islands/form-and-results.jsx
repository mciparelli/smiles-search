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
import { apiPath, findFlightsForDate, findFlightsInMonth } from "api";
import MainForm from "./main-form.jsx";
import Filters from "./filters.jsx";
import Spinner from "components/spinner.jsx";
import { CheckIcon } from "icons";

async function onSubmit(searchParams) {
  try {
    const shouldFetch = searchParams.originAirportCode &&
      searchParams.destinationAirportCode;
    if (!shouldFetch) return null;
    const urlParams = new URLSearchParams(searchParams);
    history.replaceState(null, "", "?" + urlParams.toString());
    let flights = null;
    const month = searchParams["month[id]"];
    const monthSearch = Boolean(month);
    for (const controller of abortControllersSignal.value) {
      controller.abort();
    }
    abortControllersSignal.value = [];
    requestsSignal.value = { status: "loading" };
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
      filtered = filtered.slice(0, resultadosSignal.value);
    }
    requestsSignal.value = {
      status: "finished",
      data: flights,
      filtered,
    };
  } catch (err) {
    // if aborted, leave it loading as most likely the user fired another set of requests
    if (err.name === "AbortError") return null;
    requestsSignal.value = {
      status: "finished",
      data: null,
      error: err.message,
    };
  }
}

export default function FormAndResults({ params }) {
  const flights = requestsSignal.value.filtered;
  const isLoading = requestsSignal.value.status === "loading";
  const monthSearchSignal = useSignal(!params.departureDate);
  return (
    <div class="p-4 gap-4 flex flex-col flex-grow-[1]">
      <MainForm
        params={params}
        onSubmit={onSubmit}
        monthSearchSignal={monthSearchSignal}
      />
      {requestsSignal.value.data?.length > 0 && !isLoading && (
        <Filters
          onChange={(newFilters) => {
            requestsSignal.value = {
              ...requestsSignal.value,
              filtered: filterFlights({
                allFlights: requestsSignal.value.data,
                monthSearch: monthSearchSignal.value,
                filters: newFilters,
              }),
            };
          }}
        />
      )}
      {requestsSignal.value.status === "not initiated" &&
        (
          <p class="m-auto">
            Elija un origen, un destino y una fecha para buscar.
          </p>
        )}
      {isLoading && (
        <div class="m-auto flex flex-col items-center">
          <Spinner />
          <p class="my-4">
            Buscando resultados {requestsSignal.value.message
              ? `(${requestsSignal.value.message})`
              : ""}
          </p>
        </div>
      )}
      {Boolean(requestsSignal.value.error) &&
        requestsSignal.value.status === "finished" && (
        <p class="m-auto">{requestsSignal.value.error}</p>
      )}
      {(flights === null || flights?.length === 0) && (
        <p class="m-auto">No se encontraron vuelos para este tramo.</p>
      )}
      {flights?.length > 0 && !isLoading &&
        (
          <div class="max-w-[100vw] overflow-x-auto border border-gray-900">
            <table class="table-auto text-sm text-center min-w-[fit-content] w-full whitespace-nowrap">
              <thead class="font-bold text-slate-400">
                <tr>
                  <th class="py-4 bg-blue-400 px-2">Tramo</th>
                  <th class="bg-blue-400 px-2">Fecha y hora</th>
                  <th class="bg-blue-400 px-2 lg:hidden">Millas</th>
                  <th class="bg-blue-400 px-2">Aerolínea</th>
                  <th class="bg-blue-400 px-2">Cabina</th>
                  <th class="bg-blue-400 px-2">Escalas</th>
                  <th class="bg-blue-400 px-2">Duración</th>
                  <th class="bg-blue-400 px-2">Asientos</th>
                  <th class="bg-blue-400 px-2 hidden lg:table-cell">Millas</th>
                  <th class="bg-blue-400 px-2">Tasas</th>
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
                      <td class={`${bgColor} py-4 px-2`}>
                        <a
                          class="text-blue-500"
                          target="_blank"
                          href={getLink(flight)}
                        >
                          {flight.origin}-{flight.destination}
                        </a>
                      </td>
                      <td class={`${bgColor} py-px-2 md:hidden`}>
                        {formatFlightDateShort(flight.departureDate)}
                      </td>
                      <td class={`${bgColor} py-px-2 hidden md:table-cell`}>
                        {formatFlightDateLong(flight.departureDate)}
                      </td>
                      <td class={`${bgColor} px-2 lg:hidden`}>
                        {new Intl.NumberFormat("es-AR").format(
                          flight.fare.miles,
                        )}
                      </td>
                      <td class={`${bgColor} px-2`}>{flight.airline.name}</td>
                      <td class={`${bgColor} px-2`}>
                        {filtros.cabinas.find((someCabina) =>
                          someCabina.id === flight.cabin
                        ).name}
                      </td>
                      <td class={`${bgColor} px-2`}>
                        {flight.stops || "Directo"}
                      </td>
                      <td class={`${bgColor} px-2`}>
                        {flight.durationInHours}hs
                      </td>
                      <td class={`${bgColor} px-2`}>{flight.availableSeats}</td>
                      <td class={`${bgColor} px-2 hidden lg:table-cell`}>
                        {new Intl.NumberFormat("es-AR").format(
                          flight.fare.miles,
                        )}
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
