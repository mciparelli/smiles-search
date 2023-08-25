import { searchFlights } from "./smiles-api.js";
import {
  formatDate,
  maxDate,
  minDate,
} from "./dates.js";
import { requestsSignal } from "./signals.js";
import { clone } from "./object.js";

function findFlightsForDate({ from, to, date }) {
  const requestKey = `${from}-${to} ${date}`;
  requestsSignal.value.requests[requestKey] = "loading";
  requestsSignal.value = clone(requestsSignal.value);
  return searchFlights({
    originAirportCode: from,
    destinationAirportCode: to,
    departureDate: date,
  }).then((result) => {
    requestsSignal.value.requests[requestKey] = "done";
    requestsSignal.value = clone(requestsSignal.value);
    return result;
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
