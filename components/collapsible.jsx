import { Disclosure, Transition } from "@headlessui/react";
import { ChevronDownIcon, ChevronUpIcon } from "icons";

export default function Collapsible(
  { text, as, children, class: className, ...props },
) {
  return (
    <Disclosure as={as} {...props}>
      {({ open }) => (
        <>
          <Disclosure.Button class="flex w-full justify-between rounded-lg bg-blue-100 px-4 py-2 text-left text-sm font-medium text-black-900 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75">
            <span>{text}</span>
            {open
              ? <ChevronUpIcon class="h-5 w-5 text-black-500" />
              : <ChevronDownIcon class="h-5 w-5 text-black-500" />}
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
              class={`p-4 gap-4 bg-blue-100 mt-2 whitespace-nowrap flex flex-col ${className}`}
            >
              {children}
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
}
