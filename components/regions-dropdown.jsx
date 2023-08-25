import Dropdown from "components/dropdown.jsx";
import { regionsSignal } from "utils/signals.js";

export default function RegionsDropdown(
  { class: className, name, defaultValue, placeholder = "Elija una región" },
) {
  const validRegions = regionsSignal.value.filter((someRegion) => {
    return someRegion.name && someRegion.airports[0];
  }).sort((a, b) => a.name.localeCompare(b.name)).map((region) => region.name);
  return (
    <Dropdown
      class={className}
      name={name}
      defaultValue={defaultValue}
    >
      <Dropdown.Button>
        {({ value }) => value ? value : placeholder}
      </Dropdown.Button>
      <Dropdown.Options>
        {validRegions.map((regionName) => (
          <Dropdown.Option key={regionName} value={regionName}>
            {regionName}
          </Dropdown.Option>
        ))}
      </Dropdown.Options>
    </Dropdown>
  );
}
