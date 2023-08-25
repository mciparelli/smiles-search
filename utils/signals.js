import { signal } from "@preact/signals";
import { persistedSignal } from 'utils/storage.ts';
import { EMPTY_REGION } from 'utils/constants.js';

const requestsSignal = signal({});
const abortControllersSignal = signal([]);
const regionsSignal = persistedSignal([EMPTY_REGION], 'regions')

export { abortControllersSignal, requestsSignal, regionsSignal };
