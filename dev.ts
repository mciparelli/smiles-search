import { findFlightsForDate, findFlightsInMonth } from 'api';
import { months } from "utils/dates.js";
import defaultRegionsObject from "juani/data/regions.js";
const defaultRegions = Object.entries(defaultRegionsObject).map((
  [name, airports],
) => ({ name, airports }));
// #!/usr/bin/env -S deno run -A --watch=static/,routes/
import "$std/dotenv/load.ts";
let i = 0, j = 0;
for (const regionFrom of defaultRegions) {
  i++;
  for (const regionTo of defaultRegions) {
    j++;
    if (regionFrom.name === regionTo.name) continue;
    for (const month of months) {
      await findFlightsInMonth({ regionFrom, regionTo, month: month.id })
      console.log(`regionFrom ${i}/${defaultRegions.length} - regionTo ${j}/${defaultRegions.length} - month ${month.id}`)
    }
  }
  j = 0;
}

// findFlightsForDate({ from: 'EZE', to: 'FCO', date: '2024-08-10' })
// findFlightsInMonth({ from: 'EZE', to: 'FCO', month: '2024-08' })
// import "$std/dotenv/load.ts";
// import dev from "$fresh/dev.ts";
// import config from "./fresh.config.ts";

// await dev(import.meta.url, "./main.ts", config);
