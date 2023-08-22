import { Switch } from "@headlessui/react";

export default function MonthSearch({ signal }) {
  return (
    <Switch.Group as="div" class="flex items-center gap-4">
      <Switch.Label>Búsqueda por mes</Switch.Label>
      <Switch
        checked={signal.value === true}
        onChange={(newValue) => signal.value = newValue}
        class={`${
          signal.value ? "bg-blue-600" : "bg-blue-100"
        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
      >
        <span
          class={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
            signal.value ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </Switch>
    </Switch.Group>
  );
}
