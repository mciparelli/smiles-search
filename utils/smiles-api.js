import FetchRetry from "fetch-retry";
import Bottleneck from "bottleneck";
import { effect } from "@preact/signals";
import { fares, sortByMilesAndTaxes, tripTypes } from "./flight.js";
import {
  abortControllersSignal,
  concurrencySignal,
  requestsSignal,
} from "./signals.js";

const limiter = new Bottleneck({
  maxConcurrent: concurrencySignal.value,
});

effect(() => {
  limiter.updateSettings({
    maxConcurrent: concurrencySignal.value,
  });
});

const fetch = limiter.wrap(FetchRetry(globalThis.fetch, {
  retryDelay: function (attempt, _error, _response) {
    return Math.pow(2, attempt) * 1000;
  },
  retryOn: async function (attempt, error, response) {
    if (attempt > 3) return false;
    const status = response?.status;
    if (status === 452) {
      const { error: errorMessage } = await response.json();
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
}));

const defaultParams = {
  adults: "1",
  children: "0",
  infants: "0",
  currencyCode: "ARS",
  isFlexibleDateChecked: false,
  r: "ar",
  tripType: tripTypes.ONE_WAY,
  cabinType: "all",
  forceCongener: false,
};

const headers = {
  authorization:
    "Bearer Ghlpz2Fv1P5k9zGSUz2Z3l5jdVmy0aNECen0CV5v1sevBwTX9cA9kc",
  "x-api-key": "aJqPU7xNHl9qN3NVZnPaJ208aPo2Bh2p2ZV844tw",
  "Content-Type": "application/json",
  Accept: "application/json",
  region: "ARGENTINA",
};

async function _getTax({ flightUid, fare }) {
  const params = new URLSearchParams({
    adults: "1",
    children: "0",
    infants: "0",
    fareuid: fare.uid,
    uid: flightUid,
    type: "SEGMENT_1",
    highlightText: fare.type,
  });

  const response = await fetch(
    "https://api-airlines-boarding-tax-prd.smiles.com.br/v1/airlines/flight/boardingtax?" +
      params.toString(),
    {
      headers,
    },
  );
  const { totals: { totalBoardingTax: tax } } = await response.json();
  return { miles: tax.miles, money: tax.money };
}

async function searchFlights(paramsObject) {
  const controller = new AbortController();
  abortControllersSignal.value = [...abortControllersSignal.value, controller];
  const params = new URLSearchParams({ ...defaultParams, ...paramsObject });
  const response = await fetch(
    "https://api-air-flightsearch-prd.smiles.com.br/v1/airlines/search?" +
      params.toString(),
    {
      signal: controller.signal,
      headers,
    },
  );
  const { requestedFlightSegmentList: [{ flightList }] } = await response
    .json();
  if (flightList.length === 0) return null;
  requestsSignal.value = {
    ...requestsSignal.value,
    message:
      `${paramsObject.originAirportCode}-${paramsObject.destinationAirportCode} ${paramsObject.departureDate}`,
  };
  const FARE_TYPE = fares.club;
  const transformedFlights = await Promise.all(
    flightList.map(async (someFlight) => {
      const fare = someFlight.fareList.find((someFare) =>
        someFare.type === FARE_TYPE
      );
      return {
        uid: someFlight.uid,
        origin: someFlight.departure.airport.code,
        destination: someFlight.arrival.airport.code,
        viajeFacil: someFlight.codeContext === "FFY",
        fare: {
          airlineTax: Math.floor(fare.airlineTax / 1000),
          miles: fare.miles,
          money: fare.money,
          // tax: await getTax({ flightUid: someFlight.uid, fare }),
          type: someFlight.sourceFare,
        },
        departureDate: new Date(someFlight.departure.date),
        stops: someFlight.stops,
        durationInHours: someFlight.duration.hours,
        airline: someFlight.airline,
        availableSeats: someFlight.availableSeats,
        cabin: someFlight.cabin,
      };
    }),
  );
  return sortByMilesAndTaxes(transformedFlights);
}

export { searchFlights };
