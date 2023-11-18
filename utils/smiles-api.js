import FetchRetry from "fetch-retry";
import { tripTypes } from "./flight.js";

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
  if (paramsObject.originAirportCode === paramsObject.destinationAirportCode) {
    return null;
  }
  const params = new URLSearchParams({ ...defaultParams, ...paramsObject });
  const response = await fetch(
    "https://api-air-flightsearch-prd.smiles.com.br/v1/airlines/search?" +
      params.toString(),
    {
      headers,
    },
  );
  const { requestedFlightSegmentList: [{ flightList }] } = await response
    .json();
  if (flightList.length === 0) return null;
  return flightList.map((someFlight) => {
    return someFlight.fareList.map((fare) => {
      return {
        uid: someFlight.uid,
        origin: someFlight.departure.airport.code,
        destination: someFlight.arrival.airport.code,
        viajeFacil: someFlight.codeContext === "FFY",
        fare: {
          airlineTax: fare.airlineTax,
          uid: fare.uid,
          miles: fare.miles,
          money: fare.money,
          type: fare.type,
        },
        fareType: someFlight.sourceFare,
        departureDate: new Date(someFlight.departure.date),
        stops: someFlight.stops,
        durationInHours: someFlight.duration.hours,
        airline: someFlight.airline,
        availableSeats: someFlight.availableSeats,
        cabin: someFlight.cabin,
      };
    });
  }).flat();
}

export { getTax, searchFlights };
