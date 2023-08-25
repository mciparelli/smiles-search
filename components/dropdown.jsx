import { useRef } from "preact/hooks";
import { Fragment } from "preact";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "icons";

function Dropdown(props) {
  const ref = useRef();
  return (
    <Listbox
      ref={ref}
      as="div"
      onChange={() => {
        const event = new Event("change");
        requestAnimationFrame(() => {
          ref.current.closest("form").dispatchEvent(event);
        });
      }}
      {...props}
      class={`relative ${props.class ?? ""}`}
    />
  );
}

Dropdown.Button = function DropdownButton({ children, ...props }) {
  return (
    <Listbox.Button
      class="relative w-full cursor-default rounded-sm bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-300"
      {...props}
    >
      {(childrenProps) => (
        <>
          {typeof children === "function" ? children(childrenProps) : children}
          <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              class="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </>
      )}
    </Listbox.Button>
  );
};

Dropdown.Options = function DropdownOptions(props) {
  return (
    <Transition
      as={Fragment}
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <Listbox.Options
        class="absolute z-10 w-full mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
        {...props}
      />
    </Transition>
  );
};

Dropdown.Option = function DropdownOption(
  { children, class: className = "", ...props },
) {
  return (
    <Listbox.Option
      class={`${className} cursor-pointer flex items-center relative cursor-default select-none py-2 px-4 gap-2 ui-active:bg-blue-100 ui-active:text-blue-900 ui-not-active:text-gray-900`}
      {...props}
    >
      {(childrenProps) => (
        <>
          {typeof children === "function" ? children(childrenProps) : children}
          {childrenProps.selected
            ? (
              <span class="text-blue-600">
                <CheckIcon class="h-5 w-5" aria-hidden="true" />
              </span>
            )
            : null}
        </>
      )}
    </Listbox.Option>
  );
};

export default Dropdown;
