import Collapsible from "components/collapsible.jsx";
import { regionsSignal } from "utils/signals.js";
import { AIRPORTS_SIZE, EMPTY_REGION, MAX_REGIONS } from "utils/constants.js";

let airports = new Array(AIRPORTS_SIZE);
airports.fill(undefined);
Object.seal(airports);

function Region({ name, selectedAirports }) {
  return (
    <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
      <input
        type="text"
        name="region_name"
        pattern="[a-zA-Z0-9_\-]{3,20}"
        placeholder="Region"
        class="shadow-md px-2 h-10 rounded-sm"
        value={name}
      />
      {airports.map((_airport, idx) => (
        <input
          key={idx}
          type="text"
          name="airport_name"
          pattern="[a-zA-Z]{3}"
          maxLength={3}
          placeholder={`Aeropuerto ${idx + 1}`}
          onInput={(ev) => ev.target.value = ev.target.value.toUpperCase()}
          class="shadow-md px-2 h-10 rounded-sm"
          value={selectedAirports?.[idx]}
        />
      ))}
    </div>
  );
}

export default function Regions() {
  return (
    <form
      name="region"
      onChange={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        let newRegions = [];
        const allNewAirports = formData.getAll("airport_name");
        let i = 0;
        for (const regionName of formData.getAll("region_name")) {
          const newIndex = i + AIRPORTS_SIZE;
          const selectedAirports = Array.from(
            new Set(allNewAirports.slice(i, newIndex).filter(Boolean)),
          );
          i = newIndex;
          newRegions = [...newRegions, {
            name: regionName,
            airports: selectedAirports,
          }];
        }
        if (
          newRegions.length < MAX_REGIONS &&
          newRegions[newRegions.length - 1].name !== ""
        ) {
          regionsSignal.value = [...newRegions, EMPTY_REGION];
        } else {
          regionsSignal.value = newRegions;
        }
      }}
    >
      <Collapsible text="Regiones" class="gap-8">
        {regionsSignal.value?.map((someRegion, idx) => (
          <Region
            key={idx}
            name={someRegion.name}
            selectedAirports={someRegion.airports}
          />
        ))}
      </Collapsible>
    </form>
  );
}
