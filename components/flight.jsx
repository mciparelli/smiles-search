import useSWR from "swr";
import { fares, filtros, getLink } from "utils/flight.js";
import { getTax } from "utils/smiles-api.js";
import { formatFlightDateLong, formatFlightDateShort } from "utils/dates.js";
import Spinner from "components/spinner.jsx";

function Tax({ data, error, isLoading }) {
  return (
    <>
      {isLoading && <Spinner />}
      {data && `$${Math.floor(data.money / 1000)}K`}
      {!isLoading && !data && error && "?"}
    </>
  );
}

export default function Flight({ flight, canje, bgColor }) {
  const taxInfo = useSWR(
    { flightUid: flight.uid, fare: flight.fare },
    getTax,
  );
  const milesDisplay = (
    <>
      {new Intl.NumberFormat("es-AR").format(
        flight.fare.miles,
      )}
      {canje.id === fares.moneyClub && flight.fare.money &&
        ` + $${Math.floor(flight.fare.money / 1000)}K`}
    </>
  );
  return (
    <tr class="text-slate-500 whitespace-nowrap">
      <td class={`${bgColor} py-4 px-2`}>
        <a
          class="text-blue-500"
          target="_blank"
          href={getLink(flight)}
        >
          {flight.origin}-{flight.destination}
        </a>
      </td>
      <td class={`${bgColor} py-px-2 md:hidden`}>
        {formatFlightDateShort(flight.departureDate)}
      </td>
      <td class={`${bgColor} py-px-2 hidden md:table-cell`}>
        {formatFlightDateLong(flight.departureDate)}
      </td>
      <td class={`${bgColor} px-2 lg:hidden`}>
        <div class="inline-flex">
          {milesDisplay} + <Tax {...taxInfo} />
        </div>
      </td>
      <td class={`${bgColor} px-2`}>{flight.airline.name}</td>
      <td class={`${bgColor} px-2`}>
        {filtros.cabinas.find((someCabina) => someCabina.id === flight.cabin)
          .name}
      </td>
      <td class={`${bgColor} px-2`}>
        {flight.stops || "Directo"}
      </td>
      <td class={`${bgColor} px-2`}>
        {flight.durationInHours}hs
      </td>
      <td class={`${bgColor} px-2`}>{flight.availableSeats}</td>
      <td class={`${bgColor} px-2 hidden lg:table-cell`}>
        <div class="inline-flex">
          {milesDisplay} + <Tax {...taxInfo} />
        </div>
      </td>
    </tr>
  );
}
