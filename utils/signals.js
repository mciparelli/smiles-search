import { signal } from "@preact/signals";

const requestsSignal = signal({});
const abortControllersSignal = signal([]);

export { abortControllersSignal, requestsSignal };
