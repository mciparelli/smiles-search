import defaultRegionsObject from "juani/data/regions.js";
import { findFlightsForDate } from "utils/api.js";
import { formatDate } from "utils/dates.js";

const regions = Object.entries(defaultRegionsObject);

export default async function seed(date) {
  for (const regionFrom of regions) {
    const [_regionFromName, airportsFrom] = regionFrom;
    for (const regionTo of regions) {
      const [_regionToName, airportsTo] = regionTo;
      await findFlightsForDate({
        from: airportsFrom,
        to: airportsTo,
        date: formatDate(date),
      });
    }
  }
}
