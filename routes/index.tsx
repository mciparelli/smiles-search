import FormAndResults from "islands/form-and-results.jsx";
import {
  filterFlights,
  filtros,
  getLink,
  sortByMilesAndTaxes,
} from "utils/flight.js";
import { findFlightsForDate, findFlightsInMonth } from "api";

async function performSearch(searchParams) {
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
  let flights = null;
  const month = searchParams["month[id]"];
  const monthSearch = Boolean(month);
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
  const filtered = filterFlights({
    allFlights: flights,
    monthSearch,
    filters: {
      "canje[id]": filtros.defaults.canje.id,
    },
  });
  return {
    flights,
    filtered
  };
}

export async function handler(request, ctx) {
  const url = new URL(request.url)
  const params = new URLSearchParams(url.search)
  const data = await performSearch(Object.fromEntries(params));
  return ctx.render(data);
}

export default function Home({ data, url }) {
  return (
    <FormAndResults
      flights={data?.flights}
      filtered={data?.filtered}
      params={Object.fromEntries(new URLSearchParams(url.search))}
    />
  );
}
