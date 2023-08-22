import { searchFlights } from "./smiles-api.js";
import { formatDate, maxDate, minDate } from "./dates.js";

function findFlightsForDate({ from, to, date }) {
  return searchFlights({
    originAirportCode: from,
    destinationAirportCode: to,
    departureDate: date,
  });
}

function findFlightsInMonth({ from, to, month }) {
  let firstDay = new Date(month);
  firstDay.setHours(firstDay.getHours() + 3); // remove tz
  let currentDay = new Date(firstDay);
  let flightPromises = [];
  do {
    if (minDate <= currentDay && maxDate >= currentDay) {
      const dayFlightsPromise = findFlightsForDate({
        from,
        to,
        date: formatDate(currentDay),
        limit: 1,
      });
      flightPromises = [...flightPromises, dayFlightsPromise];
    }
    currentDay.setDate(currentDay.getDate() + 1);
  } while (firstDay.getMonth() === currentDay.getMonth());
  return Promise.all(flightPromises);
}

const apiPath = "/query-results";

export { apiPath, findFlightsForDate, findFlightsInMonth };
