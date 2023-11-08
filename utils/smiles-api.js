import FetchRetry from "fetch-retry";
import { tripTypes } from "./flight.js";

const client = Deno.createHttpClient({
  proxy: { 
    basicAuth: {username: 'customer-mciparelli-cc-br', password: 'Mc33264197'}, 
    url: `socks5h://pr.oxylabs.io:7777` }
});

const fetch = FetchRetry(globalThis.fetch, {
  retryDelay: function (attempt, _error, _response) {
    return Math.pow(2, attempt) * 1000;
  },
  retryOn: async function (attempt, error, response) {
    if (attempt > 3) return false;
    console.log(attempt,error, error?.name)
    const status = response?.status;
    if (status === 452) {
      const errorResponse = await response.json();
      const errorMessage = errorResponse.error ?? errorResponse.errorMessage;
      if (!errorMessage.startsWith("TypeError")) throw new Error(`${response.url} failed with: ${errorMessage}`);
      console.log(`retrying, attempt number ${attempt + 1}`);
      return true;
    }
    // retry on any network error, or 5xx status codes
    if (error !== null || status >= 500) {
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

async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 30000 } = options;
  
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(resource, {
    ...options,
    signal: controller.signal  
  });
  clearTimeout(id);

  return response;
}

async function searchFlights(paramsObject) {
  const params = new URLSearchParams({ ...defaultParams, ...paramsObject });
    console.time(params.toString())
  try {
  const response = await fetchWithTimeout(
    "https://api-air-flightsearch-prd.smiles.com.br/v1/airlines/search?" +
      params.toString(),
    {
      client,
      headers,
    },
  );
  console.timeEnd(params.toString())
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
} catch(err) {
  console.log("https://api-air-flightsearch-prd.smiles.com.br/v1/airlines/search?" +
      params.toString())
  return 'failed';
}
}

export { getTax, searchFlights };
