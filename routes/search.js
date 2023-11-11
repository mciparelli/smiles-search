import { cachified, verboseReporter } from 'cachified';
import makeCache from 'utils/cache.js';

const client = Deno.createHttpClient({
  proxy: { 
    basicAuth: {username: Deno.env.get('PROXY_USER'), password: Deno.env.get('PROXY_PW')}, 
    url: `socks5h://pr.oxylabs.io:7777` }
});

const headers = {
  authorization:
    "Bearer Ghlpz2Fv1P5k9zGSUz2Z3l5jdVmy0aNECen0CV5v1sevBwTX9cA9kc",
  "x-api-key": "aJqPU7xNHl9qN3NVZnPaJ208aPo2Bh2p2ZV844tw",
  "Content-Type": "application/json",
  Accept: "application/json",
  region: "ARGENTINA",
};

function searchCached(params) {
  return cachified({
    reporter: verboseReporter(),
    key: `${params.get('originAirportCode')}:${params.get('destinationAirportCode')}:${params.get('departureDate')}`,
    cache: makeCache('smiles'),
    getFreshValue() {
      return fetch('https://api-air-flightsearch-prd.smiles.com.br/v1/airlines/search?' + params.toString(), {
        client,
        headers
      }).then(res => res.json());
    },
    // good for 12 hours
    ttl: 1000 * 60 * 60 * 12,
    // one year
    swr: 1000 * 60 * 60 * 24 * 365
  }); 
}

export async function handler(req) {
  const url = new URL(req.url);
  const value = await searchCached(url.searchParams);
  return new Response(JSON.stringify(value), {
    headers: { "Content-Type": "application/json" },
  });
}