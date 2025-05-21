import FetchRetry from "fetch-retry";
// import { effect } from "@preact/signals";
import { tripTypes } from "./flight.js";
import {
  abortControllersSignal,
  // concurrencySignal,
  requestsSignal,
} from "./signals.js";

// effect(() => {
//   limiter.updateSettings({
//     maxConcurrent: concurrencySignal.value,
//   });
// });

const fetch = FetchRetry(globalThis.fetch, {
  retryDelay: function (attempt, _error, _response) {
    return Math.pow(2, attempt) * 1000;
  },
  retryOn: async function (attempt, error, response) {
    if (attempt > 3) return false;
    const status = response?.status;
    if (status === 452) {
      const errorResponse = await response.json();
      const errorMessage = errorResponse.error ?? errorResponse.errorMessage;
      if (!errorMessage.startsWith("TypeError")) throw new Error(errorMessage);
      console.log(`retrying, attempt number ${attempt + 1}`);
      return true;
    }
    // retry on any network error, or 5xx status codes
    if (error !== null || status >= 500) {
      if (error?.name === "AbortError") return false;
      console.log(`retrying, attempt number ${attempt + 1}`);
      console.log({ error, status });
      return true;
    }
  },
});

const defaultParams = {
  adults: "1",
  children: "0",
  infants: "0",
  currencyCode: "ARS",
  isFlexibleDateChecked: false,
  r: "ar",
  tripType: tripTypes.ONE_WAY,
  cabinType: "all",
  forceCongener: true,
};
async function getTax({ flightUid, fare }) {
  const params = new URLSearchParams({
    adults: "1",
    children: "0",
    infants: "0",
    fareuid: fare.uid,
    uid: flightUid,
    type: "SEGMENT_1",
    highlightText: fare.type,
  });

  const response = await globalThis.fetch("/tax?" + params.toString());
  const {
    totals: { totalBoardingTax: tax },
  } = await response.json();
  return { miles: tax.miles, money: tax.money };
}

async function searchFlights(paramsObject) {
  const controller = new AbortController();
  abortControllersSignal.value = [...abortControllersSignal.value, controller];
  const params = new URLSearchParams({ ...defaultParams, ...paramsObject });
  // params.set("departureDate", new Date(paramsObject.departureDate).getTime());
  const response = await fetch(
    window.SEARCH_URL + "/search?" + params.toString(),
    {
      signal: controller.signal,
      headers: {
        "ngrok-skip-browser-warning": "1",
      },
    },
  );
  if (!response.ok) return null;
  requestsSignal.value = {
    ...requestsSignal.value,
    message: `${paramsObject.originAirportCode}-${paramsObject.destinationAirportCode} ${paramsObject.departureDate}`,
  };
  return response.json();
}

export { getTax, searchFlights };
