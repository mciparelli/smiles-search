import { useRef } from "preact/hooks";
import { filtros } from "utils/flight.js";
import { ArrowPathIcon } from "icons";
import RegionsDropdown from "./regions-dropdown.jsx";

export default function OriginDestinationInputs({ defaults, searchType }) {
  const originRef = useRef();
  const destinationRef = useRef();
  return (
    <fieldset class="group flex gap-2 w-full">
      {["from-region-to-airport", "from-region-to-region"].includes(searchType)
        ? (
          <RegionsDropdown
            defaultValue={defaults["region_from"]}
            name="region_from"
            class="w-32"
            placeholder="Desde"
          />
        )
        : (
          <input
            name="originAirportCode"
            required
            type="text"
            pattern="[a-zA-Z]{3}"
            class="shadow-md px-2 h-10 w-32 rounded-sm"
            placeholder="Desde"
            maxLength={3}
            onInput={(ev) => ev.target.value = ev.target.value.toUpperCase()}
            ref={originRef}
            value={defaults.originAirportCode ??
              filtros.defaults.originAirportCode}
          />
        )}
      {["from-airport-to-region", "from-region-to-region"].includes(searchType)
        ? (
          <RegionsDropdown
            defaultValue={defaults["region_to"]}
            name="region_to"
            class="w-32"
            placeholder="Hasta"
          />
        )
        : (
          <input
            name="destinationAirportCode"
            required
            type="text"
            pattern="[a-zA-Z]{3}"
            class="shadow-md px-2 h-10 w-32 rounded-sm"
            placeholder="Hacia"
            maxLength={3}
            onInput={(ev) => ev.target.value = ev.target.value.toUpperCase()}
            ref={destinationRef}
            value={defaults.destinationAirportCode}
            autoFocus
          />
        )}
      {"airports" === searchType && (
        <button type="button" class="px-2">
          <ArrowPathIcon
            class="h-5 w-5"
            aria-hidden="true"
            onClick={() => {
              const currentOrigin = originRef.current.value;
              originRef.current.value = destinationRef.current.value;
              destinationRef.current.value = currentOrigin;
            }}
          />
        </button>
      )}
    </fieldset>
  );
}
