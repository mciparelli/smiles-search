import { searchFlights } from "./smiles-api.js";
import { formatDate, maxDate, minDate } from "./dates.js";
import { sortByMilesAndTaxes } from "./flight.js";

async function findFlightsForDate({ from, regionFrom, to, regionTo, date }) {
  let flightPromises = [];
  let fromAirports = from ? [from] : regionFrom.airports;
  let toAirports = to ? [to] : regionTo.airports;
  for (const airportFrom of fromAirports) {
    for (const airportTo of toAirports) {
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
  return sortByMilesAndTaxes(allFlightsArray.flat().filter(Boolean));
}

function findFlightsInMonth({ from, regionFrom, to, regionTo, month }) {
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
  return Promise.all(flightPromises);
}

const apiPath = "/query-results";

export { apiPath, findFlightsForDate, findFlightsInMonth };
