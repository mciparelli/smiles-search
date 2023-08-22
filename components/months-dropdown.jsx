import Dropdown from "components/dropdown.jsx";
import { months } from "utils/dates.js";

export default function MonthsDropdown(
  { defaultValue = months[0].id, ...props },
) {
  return (
    <Dropdown
      name="month"
      defaultValue={months.find((someMonth) => someMonth.id === defaultValue)}
      {...props}
    >
      <Dropdown.Button>{({ value }) => `Mes: ${value.name}`}</Dropdown.Button>
      <Dropdown.Options>
        {months.map((option) => (
          <Dropdown.Option key={option.id} class="capitalize" value={option}>
            {option.name}
          </Dropdown.Option>
        ))}
      </Dropdown.Options>
    </Dropdown>
  );
}
