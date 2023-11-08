import pLimit from 'https://esm.sh/p-limit';
import { cachified } from 'cachified';
import makeCache from 'utils/cache.js';
import { searchFlights } from "./smiles-api.js";
import { formatDate, maxDate, minDate } from "./dates.js";
import { sortByMilesAndTaxes } from "./flight.js";

// const limit = pLimit(20)

async function searchCached(params) {
  try {
  const res = await cachified({
    checkValue(value) {
      if (value === 'failed') return 'Fetch failed.';
    },
    key: `${params.originAirportCode}:${params.destinationAirportCode}:${params.departureDate}`,
    cache: makeCache('smiles'),
    getFreshValue() {
      return searchFlights(params);
    },
    // good for 12 hours
    ttl: 1000 * 60 * 60 * 12,
    // one year
    swr: 1000 * 60 * 60 * 24 * 365
  }); 
  return res;
} catch(err) {
    console.log(err)
  }
}

async function findFlightsForDate({ from, regionFrom, to, regionTo, date }) {
  let flightPromises = [];
  let fromAirports = from ? [from] : regionFrom.airports;
  let toAirports = to ? [to] : regionTo.airports;
  for (const airportFrom of fromAirports) {
    for (const airportTo of toAirports) {
      if (airportFrom === airportTo) continue;
      flightPromises = [
        ...flightPromises,
        searchCached({
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

async function findFlightsInMonth({ from, regionFrom, to, regionTo, month }) {
  let firstDay = new Date(month);
  firstDay.setHours(firstDay.getHours() + 3); // remove tz
  let currentDay = new Date(firstDay);
  let flightPromises = [];
  do {
    if (minDate <= currentDay && maxDate >= currentDay) {
      const dayFlightsPromise = findFlightsForDate({
        from,
        regionFrom,
        to,
        regionTo,
        date: formatDate(currentDay),
      });
      flightPromises = [...flightPromises, dayFlightsPromise];
    }
    currentDay.setDate(currentDay.getDate() + 1);
  } while (firstDay.getMonth() === currentDay.getMonth());
  // console.time(regionFrom?.name + '-' + regionTo?.name + '-' + month)
  const res = await Promise.all(flightPromises);
  // console.timeEnd(regionFrom?.name + '-' + regionTo?.name + '-' + month)
  return res;
}

const apiPath = "/query-results";

export { apiPath, findFlightsForDate, findFlightsInMonth };
