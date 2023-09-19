import { resultadosSignal } from "./signals.js";

const fares = {
  moneyClub: "SMILES_MONEY_CLUB",
  club: "SMILES_CLUB",
};

const tripTypes = {
  RETURN: "1",
  ONE_WAY: "2",
};

function getLink(flight) {
  const params = new URLSearchParams({
    originAirportCode: flight.origin,
    destinationAirportCode: flight.destination,
    departureDate: flight.departureDate.getTime(),
    adults: "1",
    infants: "0",
    children: "0",
    cabinType: flight.cabin,
    tripType: tripTypes.ONE_WAY,
  });
  return `https://www.smiles.com.ar/emission?${params.toString()}`;
}

function sortByMilesAndTaxes(flightList) {
  return flightList.sort(
    (a, b) => {
      if (a.fare.miles === b.fare.miles) {
        if (a.fare.money === b.fare.money) {
          return a.fare.airlineTax - b.fare.airlineTax;
        } else {
          return a.fare.money - b.fare.money;
        }
      }
      return a.fare.miles - b.fare.miles;
    },
  );
}

const cabinas = [
  { id: "all", name: "Todas" },
  { id: "ECONOMIC", name: "Económica" },
  { id: "PREMIUM_ECONOMIC", name: "Económica Premium" },
  { id: "COMFORT", name: "Confort (GOL)" },
  { id: "BUSINESS", name: "Ejecutiva" },
];

const airlineCodes = [
  { id: "AA", name: "American Airlines" },
  { id: "AR", name: "Aerolíneas Argentinas" },
  { id: "UX", name: "Air Europa" },
  { id: "AM", name: "AeroMéxico" },
  { id: "AV", name: "Avianca" },
  { id: "CM", name: "Copa Airlines" },
  { id: "AF", name: "Air France" },
  { id: "KL", name: "KLM" },
  { id: "AC", name: "Air Canadá" },
  { id: "IB", name: "Iberia" },
  { id: "EK", name: "Emirates" },
  { id: "TK", name: "Turkish Airlines" },
  { id: "TP", name: "TAP Portugal" },
  { id: "SA", name: "SouthAfrican Airways" },
  { id: "ET", name: "Ethiopian Airways" },
  { id: "AT", name: "Royal Air Maroc" },
  { id: "KE", name: "Korean Air" },
  { id: "2Z", name: "Voe Pass" },
  { id: "G3", name: "Gol" },
  { id: "VH", name: "Viva Air" },
  { id: "A3", name: "Aegean" },
  { id: "MS", name: "Egyptair" },
  { id: "AS", name: "Alaska Airlines" },
  { id: "EI", name: "Aer Lingus" },
  { id: "VA", name: "Virgin Australia" },
  { id: "V7", name: "Volotea" },
  { id: "NH", name: "Ana" },
  { id: "XW", name: "Sky Express" },
  { id: "AI", name: "Air India" },
  { id: "4O", name: "Interjet" },
  { id: "OU", name: "Croatia Airlines" },
  { id: "UP", name: "Bahamas Air" },
  { id: "HA", name: "Hawaiian Airlines" },
  { id: "OB", name: "Boliviana de Aviación" },
  { id: "TR", name: "Scoot" },
  { id: "OK", name: "Czech Airlines" },
  { id: "JQ", name: "Jetstar" },
  { id: "MN", name: "Kulula" },
  { id: "PG", name: "Bangkok Airways" },
  { id: "WM", name: "Winair" },
  { id: "KQ", name: "Kenya Airways" },
  { id: "BT", name: "Air Baltic" },
  { id: "MU", name: "China Estern" },
  { id: "ZP", name: "Paranair" },
  { id: "ME", name: "MEA" },
  { id: "GA", name: "Garuda Indonesia" },
  { id: "HO", name: "Juneyao Airlines" },
  { id: "SG", name: "SpiceJet" },
  { id: "PY", name: "Surinam Airways" },
  { id: "PS", name: "UIA" },
  { id: "CX", name: "Cathay Pacific" },
  { id: "TG", name: "THAI" },
  { id: "JL", name: "Japan Airlines" },
  { id: "S7", name: "S7 Airlines" },
  { id: "FA", name: "FlySafair" },
  { id: "H2", name: "SKY Airline" },
].sort((a, b) => a.name.localeCompare(b.name));

const escalas = [
  { id: "", name: "Indistinto" },
  { id: 0, name: "Ninguna" },
  { id: 1, name: "Una o ninguna" },
  { id: 2, name: "Dos o menos" },
];
const viajeFacil = [{ id: "", name: "Indistinto" }, {
  id: "1",
  name: "Sólo viaje fácil",
}];
const vuelosABrasil = [{ id: "false", name: "GOL" }, {
  id: "true",
  name: "Otras aerolíneas",
}];
const tarifas = [{ id: "", name: "Todas" }, {
  id: "AWARD",
  name: "Sólo Award",
}];
const canje = [{ id: fares.club, name: "Millas" }, {
  id: fares.moneyClub,
  name: "Smiles and Money",
}];

const searchTypes = [
  { id: "airports", name: "Aeropuertos y ciudades" },
  { id: "from-airport-to-region", name: "De aeropuerto a región" },
  { id: "from-region-to-airport", name: "De región a aeropuerto" },
  { id: "from-region-to-region", name: "De región a región" },
];

const filtros = {
  cabinas,
  airlineCodes,
  escalas,
  viajeFacil,
  vuelosABrasil,
  canje,
  searchTypes,
  tarifas,
  defaults: {
    originAirportCode: "EZE",
    cabina: cabinas[0],
    airlineCodes: [],
    escalas: escalas[0],
    viajeFacil: viajeFacil[0],
    tarifas: tarifas[0],
    searchTypes: searchTypes[0],
    canje: canje[0],
  },
};

function filterFlights({ allFlights, monthSearch, filters }) {
  const airlineCodes = Object.entries(filters).filter(([key, _value]) =>
    key.startsWith("airlines") && key.endsWith("[id]")
  ).map(([_key, value]) => value);
  const filterFunction = (someFlight) => {
    let cabinFilter = true,
      airlinesFilter = true,
      stopsFilter = true,
      viajeFacilFilter = true,
      tarifaFilter = true,
      canjeFilter = true,
      hoursFilter = true;
    if (
      filters["cabinType[id]"] &&
      filters["cabinType[id]"] !== filtros.defaults.cabina.id
    ) {
      cabinFilter = someFlight.cabin === filters["cabinType[id]"];
    }
    if (airlineCodes.length > 0) {
      airlinesFilter = airlineCodes.includes(someFlight.airline.code);
    }
    if (
      filters["stops[id]"] &&
      filters["stops[id]"] !== filtros.defaults.escalas.id
    ) {
      stopsFilter = someFlight.stops <= Number(filters["stops[id]"]);
    }
    if (filters["viaje-facil[id]"] === "1") {
      viajeFacilFilter = someFlight.viajeFacil;
    }
    if (
      filters["tarifa[id]"] &&
      filters["tarifa[id]"] !== filtros.defaults.tarifas.id
    ) {
      tarifaFilter = someFlight.fareType === filters["tarifa[id]"];
    }
    if (filters["canje[id]"]) {
      canjeFilter = someFlight.fare.type === filters["canje[id]"];
    }
    if (filters["maxhours"]) {
      hoursFilter = someFlight.durationInHours <= Number(filters["maxhours"]);
    }
    return [
      cabinFilter,
      airlinesFilter,
      stopsFilter,
      viajeFacilFilter,
      tarifaFilter,
      canjeFilter,
      hoursFilter,
    ].every((filter) => filter);
  };
  let filtered;
  if (monthSearch) {
    filtered = allFlights.map((dayFlights) =>
      dayFlights?.filter(filterFunction)?.[0]
    ).filter(Boolean);
  } else {
    filtered = allFlights.filter(filterFunction);
  }
  filtered = sortByMilesAndTaxes(filtered);
  return filtered.slice(0, resultadosSignal.value);
}

export {
  fares,
  filterFlights,
  filtros,
  getLink,
  sortByMilesAndTaxes,
  tripTypes,
};
