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
import Flight from "components/flight.jsx";
import { CheckIcon } from "icons";
import Regions from "components/regions.jsx";
import { regionsSignal } from "utils/signals.js";

async function onSubmit(searchParams) {
  try {
    let shouldFetch = true,
      regionFrom = searchParams["region_from"]
        ? regionsSignal.value.find((someRegion) =>
          someRegion.name === searchParams["region_from"]
        )
        : null,
      regionTo = searchParams["region_to"]
        ? regionsSignal.value.find((someRegion) =>
          someRegion.name === searchParams["region_to"]
        )
        : null;
    if (searchParams["search_type[id]"] === "from-region-to-airport") {
      shouldFetch = searchParams["region_from"] &&
        searchParams.destinationAirportCode && regionFrom?.airports[0];
    } else if (searchParams["search_type[id]"] === "airports") {
      shouldFetch = searchParams.originAirportCode &&
        searchParams.destinationAirportCode;
    } else if (searchParams["search_type[id]"] === "from-airport-to-region") {
      shouldFetch = searchParams["region_to"] &&
        searchParams.originAirportCode && regionTo?.airports[0];
    } else {
      shouldFetch = searchParams["region_to"] && regionTo?.airports[0] &&
        searchParams["region_from"] && regionFrom?.airports[0];
    }
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
        regionFrom,
        to: searchParams.destinationAirportCode,
        regionTo,
        month,
      });
      flights = monthFlights;
    } else {
      flights = await findFlightsForDate({
        from: searchParams.originAirportCode,
        regionFrom,
        to: searchParams.destinationAirportCode,
        regionTo,
        date: searchParams.departureDate,
      });
    }
    const initialFilters = {
      "canje[id]": filtros.defaults.canje.id,
    };
    const filtered = filterFlights({
      allFlights: flights,
      monthSearch,
      filters: initialFilters,
    });
    requestsSignal.value = {
      status: "finished",
      data: flights,
      currentFilters: initialFilters,
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
  const isMonthSearch = !params.departureDate;
  const canjeId = requestsSignal.value.currentFilters?.["canje[id]"] ??
    filtros.defaults.canje.id;
  const canje = filtros.canje.find((someCanje) => someCanje.id === canjeId);
  return (
    <div class="p-4 gap-4 flex flex-col flex-grow-[1]">
      <Regions />
      <MainForm
        params={params}
        onSubmit={onSubmit}
        initialMonthSearch={isMonthSearch}
      />
      {requestsSignal.value.data?.length > 0 && !isLoading && (
        <Filters
          onChange={(newFilters) => {
            requestsSignal.value = {
              ...requestsSignal.value,
              currentFilters: newFilters,
              filtered: filterFlights({
                allFlights: requestsSignal.value.data,
                monthSearch: isMonthSearch,
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
                {flights.map((flight, i) => {
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
