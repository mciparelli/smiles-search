import { useRef } from "preact/hooks";
import { ChevronUpIcon } from "icons";
import { filtros } from "utils/flight.js";
import { resultadosSignal, smilesAndMoneySignal } from "utils/signals.js";
import Dropdown from "components/dropdown.jsx";
import Collapsible from "components/collapsible.jsx";
import { Switch } from "@headlessui/react";

export default function Filtros({ onChange }) {
  const ref = useRef();
  return (
    <form
      ref={ref}
      onChange={(event) => {
        const formData = new FormData(event.currentTarget);
        const filters = Object.fromEntries(formData.entries());
        onChange(filters);
      }}
    >
      <label>
        Resultados<input
          type="number"
          name="results"
          max={30}
          value={resultadosSignal.value}
          onChange={(ev) => {
            resultadosSignal.value = Number(ev.target.value);
          }}
          class="h-10 ml-2 mb-2 rounded-sm px-2 w-16"
        />
      </label>
      <Collapsible text="Filtros" class="sm:grid sm:grid-cols-2 lg:grid-cols-3">
        <Dropdown
          name="airlines"
          defaultValue={filtros.defaults.airlineCodes}
          multiple
        >
          <Dropdown.Button>
            {({ value }) => (
              <div>
                Aerolíneas: {value.length > 0 ? ` (${value.length})` : "Todas"}
              </div>
            )}
          </Dropdown.Button>

          <Dropdown.Options>
            {filtros.airlineCodes.map((airline) => (
              <Dropdown.Option
                key={airline.id}
                value={airline}
              >
                {({ selected }) => (
                  <>
                    <span
                      class={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {airline.name}
                    </span>
                  </>
                )}
              </Dropdown.Option>
            ))}
          </Dropdown.Options>
        </Dropdown>
        <Dropdown name="stops" defaultValue={filtros.defaults.escalas}>
          <Dropdown.Button>
            {({ value }) => `Escalas: ${value.name}`}
          </Dropdown.Button>
          <Dropdown.Options>
            {filtros.escalas.map((escala) => (
              <Dropdown.Option
                key={escala.id}
                value={escala}
              >
                {escala.name}
              </Dropdown.Option>
            ))}
          </Dropdown.Options>
        </Dropdown>
        <Dropdown
          name="viaje-facil"
          defaultValue={filtros.defaults.viajeFacil}
        >
          <Dropdown.Button>
            {({ value }) =>
              value.id === "" ? `Viaje fácil: ${value.name}` : value.name}
          </Dropdown.Button>
          <Dropdown.Options>
            {filtros.viajeFacil.map((vf) => (
              <Dropdown.Option key={vf.id} value={vf}>
                {vf.name}
              </Dropdown.Option>
            ))}
          </Dropdown.Options>
        </Dropdown>
        <Dropdown
          name="cabinType"
          defaultValue={filtros.defaults.cabina}
        >
          <Dropdown.Button>
            {({ value }) => `Cabina: ${value.name}`}
          </Dropdown.Button>
          <Dropdown.Options>
            {filtros.cabinas.map((option) => (
              <Dropdown.Option key={option.id} value={option}>
                {option.name}
              </Dropdown.Option>
            ))}
          </Dropdown.Options>
        </Dropdown>
        <Dropdown name="tarifa" defaultValue={filtros.defaults.tarifas}>
          <Dropdown.Button>
            {({ value }) => `Tarifa: ${value.name}`}
          </Dropdown.Button>
          <Dropdown.Options>
            {filtros.tarifas.map((option) => (
              <Dropdown.Option key={option.id} value={option}>
                {option.name}
              </Dropdown.Option>
            ))}
          </Dropdown.Options>
        </Dropdown>
        <div class="flex gap-4">
          <label class="py-2">Max. horas</label>
          <input
            name="maxhours"
            type="number"
            max={36}
            class="shadow-md px-2 h-10 w-20 rounded-sm"
          />
        </div>
      </Collapsible>
      <Switch.Group as="div" class="flex items-center gap-4 mt-4 mb-2">
        <Switch.Label>Smiles and Money</Switch.Label>
        <Switch
          name="smiles-and-money"
          checked={smilesAndMoneySignal.value}
          onChange={(newValue) => {   
            smilesAndMoneySignal.value = newValue;
            const event = new Event("change");
            requestAnimationFrame(() => {
              ref.current.closest("form").dispatchEvent(event);
            });
          }}
          class={`${
            smilesAndMoneySignal.value ? "bg-blue-600" : "bg-blue-100"
          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
        >
          <span
            class={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
              smilesAndMoneySignal.value ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </Switch>
      </Switch.Group>
    </form>
  );
}
