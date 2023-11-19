import { cachified, verboseReporter } from "cachified";
import { get, remove, set } from "utils/cache.js";
import { searchFlights } from "./smiles-api.js";
import { formatDate, maxDate, minDate } from "./dates.js";
import { sortByMilesAndTaxes } from "./flight.js";

function searchCachedFlights(
  { originAirportCode, destinationAirportCode, departureDate },
) {
  return cachified({
    reporter: verboseReporter(),
    key:
      `smiles:${originAirportCode}:${destinationAirportCode}:${departureDate}`,
    cache: {
      get,
      set,
      delete: remove,
    },
    async getFreshValue() {
      const flights = await searchFlights({
        originAirportCode,
        destinationAirportCode,
        departureDate,
      });
      // cap at 100 so it fits in cache
      return flights?.slice(0, 100);
    },
    // good for three days
    ttl: 1000 * 60 * 60 * 24 * 3,
    // one year
    swr: 1000 * 60 * 60 * 24 * 365,
  });
}

async function findFlightsForDate({ from, to, date }) {
  let flightPromises = [];
  for (const airportFrom of from) {
    for (const airportTo of to) {
      flightPromises = [
        ...flightPromises,
        searchCachedFlights({
          originAirportCode: airportFrom,
          destinationAirportCode: airportTo,
          departureDate: date,
        }),
      ];
    }
  }
  const allFlightsArray = await Promise.all(flightPromises);
  return sortByMilesAndTaxes(allFlightsArray.flat().filter(Boolean));
}

function findFlightsInMonth({ from, to, month }) {
  let firstDay = new Date(month);
  firstDay.setHours(firstDay.getHours() + 3); // remove tz
  let currentDay = new Date(firstDay);
  let flightPromises = [];
  do {
    if (minDate <= currentDay && maxDate >= currentDay) {
      const date = formatDate(currentDay);
      const dayFlightsPromise = findFlightsForDate({
        from,
        to,
        date,
      });
      flightPromises = [...flightPromises, dayFlightsPromise];
    }
    currentDay.setDate(currentDay.getDate() + 1);
  } while (firstDay.getMonth() === currentDay.getMonth());
  return Promise.all(flightPromises);
}

export { findFlightsForDate, findFlightsInMonth };
