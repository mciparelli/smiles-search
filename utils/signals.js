import { signal } from "@preact/signals";
import { persistedSignal } from "./storage.ts";
import { EMPTY_REGION } from "utils/constants.js";
import defaultRegionsObject from "juani/data/regions.js";

const requestsSignal = signal({});
const abortControllersSignal = signal([]);
const resultadosSignal = persistedSignal(10, "smiles:resultados");
const concurrencySignal = persistedSignal(20, "smiles:concurrency");

const defaultRegions = Object.entries(defaultRegionsObject).map((
  [name, airports],
) => ({ name, airports }));
const regionsSignal = persistedSignal(
  [...defaultRegions, EMPTY_REGION],
  "regions",
);

export {
  abortControllersSignal,
  concurrencySignal,
  regionsSignal,
  requestsSignal,
  resultadosSignal,
};
