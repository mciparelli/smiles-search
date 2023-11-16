import { findCachedFlights, findFlightsForDate, findFlightsInMonth } from 'utils/api.js';

function searchFlights(params) {
  const month = params.get('month[id]');
  const monthSearch = Boolean(month);
  const regionFrom = params.get('region_from') ? JSON.parse(params.get('region_from')) : null;
  const regionTo = params.get('region_to') ? JSON.parse(params.get('region_to')) : null;
  const from = regionFrom ?? [params.get('originAirportCode')];
  const to = regionTo ?? [params.get('destinationAirportCode')];
  if (monthSearch) {
    return findFlightsInMonth({
      from,
      to,
      month,
    });
  }
  return findCachedFlights({
    from,
    to,
    date: params.get('departureDate'),
  });
}

export async function handler(req) {
  const url = new URL(req.url);
  // const value = await getFreshValue(url.searchParams);
  const value = await searchFlights(url.searchParams);
  return new Response(JSON.stringify(value), {
    headers: { "Content-Type": "application/json" },
  });
}