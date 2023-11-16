import { cachified, verboseReporter } from 'cachified';
import { get, set, remove } from 'utils/cache.js';
import { searchFlights } from "./smiles-api.js";
import { formatDate, maxDate, minDate } from "./dates.js";
import { sortByMilesAndTaxes } from './flight.js'

async function findFlightsForDate({ from, to, date }) {
  let flightPromises = [];
  for (const airportFrom of from) {
    for (const airportTo of to) {
      flightPromises = [
        ...flightPromises,
        searchFlights({
          originAirportCode: airportFrom,
          destinationAirportCode: airportTo,
          departureDate: date,
        }),
      ];
    }
  }
  const allFlightsArray = await Promise.all(flightPromises);
  const sortedFlights = sortByMilesAndTaxes(allFlightsArray.flat().filter(Boolean));
  // cap at 100 so it can be cached
  return sortedFlights.slice(0, 100);
}

function findCachedFlights({ from, to, date }) {
  return cachified({
    reporter: verboseReporter(),
    key: `smiles:${JSON.stringify(from)}:${JSON.stringify(to)}:${date}`,
    checkValue(value) {
      if (value === 'timeout') throw new Error('Took too long');
    },
    cache: {
      get,
      set,
      delete: remove
    },
    getFreshValue() {
      return findFlightsForDate({ from, to, date });
    },
    // good for 12 hours
    ttl: 1000 * 60 * 60 * 12,
    // one year
    swr: 1000 * 60 * 60 * 24 * 365
  }); 
}

function findFlightsInMonth({ from, to, month }) {
  let firstDay = new Date(month);
  firstDay.setHours(firstDay.getHours() + 3); // remove tz
  let currentDay = new Date(firstDay);
  let flightPromises = [];
  do {
    if (minDate <= currentDay && maxDate >= currentDay) {
      const date = formatDate(currentDay);
      const key = `cached-${from}-${to}-${date}`;
        console.time(key)
      const dayFlightsPromise = findCachedFlights({
        from,
        to,
        date
      }).then(res => {
                console.timeEnd(key);
                return res;
      });
      flightPromises = [...flightPromises, dayFlightsPromise];
    }
    currentDay.setDate(currentDay.getDate() + 1);
  } while (firstDay.getMonth() === currentDay.getMonth());
  return Promise.all(flightPromises);
}

export { findCachedFlights, findFlightsForDate, findFlightsInMonth };
