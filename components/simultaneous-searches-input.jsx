import { concurrencySignal } from "utils/signals.js";
import { InformationCircleIcon } from "icons";

export default function ConsultasEnSimultaneo({ class: className = "" }) {
  return (
    <label
      title="Un número de consultas en simultáneo demasiado alto podría causar un bloqueo temporario por parte de Smiles. Un número de consultas en simultáneo demasiado bajo podría causar mayores demoras en las búsquedas, especialmente en búsquedas por regiones."
      class={`flex ml-auto gap-2 items-center ${className}`}
    >
      <InformationCircleIcon class="w-5" />Consultas en simultáneo<input
        type="number"
        name="concurrency"
        value={String(concurrencySignal.value)}
        onChange={(ev) => {
          const newValue = Number(ev.target.value);
          if (newValue < 1 || newValue > 40) {
            concurrencySignal.value = 20;
            return;
          }
          concurrencySignal.value = newValue;
        }}
        class="w-20 shadow-md px-2 rounded-sm h-10 invalid:border invalid:border-red-400"
        max="40"
        min="1"
      />
    </label>
  );
}
