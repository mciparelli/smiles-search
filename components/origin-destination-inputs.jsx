import { filtros } from "utils/flight.js";
import RegionsDropdown from "./regions-dropdown.jsx";

export default function OriginDestinationInputs({ defaults, searchType }) {
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
            value={defaults.destinationAirportCode}
            autoFocus
          />
        )}
    </fieldset>
  );
}
