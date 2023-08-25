import Dropdown from "components/dropdown.jsx";
import { filtros } from "utils/flight.js";

export default function SearchTypeDropdown(
  { value, onChange },
) {
  return (
    <Dropdown
      name="search_type"
      value={value}
      onChange={onChange}
    >
      <Dropdown.Button>
        {({ value }) => `Tipo de búsqueda: ${value.name}`}
      </Dropdown.Button>
      <Dropdown.Options>
        {filtros.searchTypes.map((option) => (
          <Dropdown.Option key={option.id} value={option}>
            {option.name}
          </Dropdown.Option>
        ))}
      </Dropdown.Options>
    </Dropdown>
  );
}
