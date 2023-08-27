import { Disclosure, Transition } from "@headlessui/react";
import { ChevronUpIcon } from "icons";
import { filtros } from "utils/flight.js";
import { resultadosSignal } from "utils/signals.js";
import Dropdown from "components/dropdown.jsx";
import { apiPath } from "api";

export default function Filtros({ onChange }) {
  return (
    <form
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
      <Disclosure as="div">
        {({ open }) => (
          <>
            <Disclosure.Button class="flex w-full justify-between rounded-lg bg-blue-100 px-4 py-2 text-left text-sm font-medium text-black-900 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75">
              <span>Filtros</span>
              <ChevronUpIcon
                class={`${
                  open ? "" : "rotate-180 transform"
                } h-5 w-5 text-black-500`}
              />
            </Disclosure.Button>
            <Transition
              unmount={false}
              enter="transition duration-100 linear origin-top"
              enterFrom="transform scale-y-0 opacity-0"
              enterTo="transform scale-y-100 opacity-100"
              leave="transition duration-100 linear origin-top"
              leaveFrom="transform scale-y-100 opacity-100"
              leaveTo="transform scale-y-0 opacity-0"
            >
              <Disclosure.Panel
                unmount={false}
                class="p-4 flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-blue-100 mt-2 whitespace-nowrap"
              >
                <Dropdown
                  name="airlines"
                  defaultValue={filtros.defaults.airlineCodes}
                  multiple
                >
                  <Dropdown.Button>
                    {({ value }) => (
                      <div>
                        Aerolíneas:{" "}
                        {value.length > 0 ? ` (${value.length})` : "Todas"}
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
                      value.id === ""
                        ? `Viaje fácil: ${value.name}`
                        : value.name}
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
                {
                  /*<Dropdown name="smiles-and-money" defaultValue={smilesAndMoney.find(option => option.id === preferences['smiles-and-money'])}>
                  <Dropdown.Button>{({ value }) => `Smiles and Money: ${value.id === '' ? 'Deshabilitado' : 'Habilitado'}`}</Dropdown.Button>
                  <Dropdown.Options>
                    {smilesAndMoney.map(option =>
                      <Dropdown.Option key={option.id}
                        value={option}
                      >{option.name}</Dropdown.Option>
                    )}
                  </Dropdown.Options>
                </Dropdown>*/
                }
                <div class="flex gap-4">
                  <label class="py-2">Max. horas</label>
                  <input
                    name="maxhours"
                    type="number"
                    max={36}
                    class="shadow-md px-2 h-10 w-20 rounded-sm"
                  />
                </div>
              </Disclosure.Panel>
            </Transition>
          </>
        )}
      </Disclosure>
    </form>
  );
}
