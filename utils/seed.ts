import { findFlightsForDate } from "utils/api.js";
import { formatDate } from "utils/dates.js";

const airportsToSeed = ["SCL", "LIM", "BOG", "BUE", "EZE", "MVD", "ASU", "SAO", "CUN", "PTY", "PUJ", "SJO", "AUA", "HAV", "MEX", "CHI", "NYC", "LAX", "DFW", "SFO", "LAS", "MIA", "MCO", "LIS", "MAD", "BCN", "PAR", "AMS", "ROM", "LON", "FRA"];

export default function seed(date) {
  return findFlightsForDate({
    from: airportsToSeed,
    to: airportsToSeed,
    date: formatDate(date),
  });
}
