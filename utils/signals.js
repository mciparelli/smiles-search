import { signal } from "@preact/signals";
import { persistedSignal } from "./storage.ts";

const requestsSignal = signal({});
const abortControllersSignal = signal([]);
const resultadosSignal = persistedSignal(10, "smiles:resultados");

export { abortControllersSignal, requestsSignal, resultadosSignal };
