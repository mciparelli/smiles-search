import { filtros } from 'src/flight-utils';
import { Multiselect } from './multiselect';

export function Filters() {
	return (
		<>
			<Multiselect
				name="airline"
				title="$airline.filter(Boolean).length > 0 ? 'Aerolíneas: ' + $airline.filter(Boolean).join(', ') : 'Aerolíneas: Todas'"
				options={filtros.airlineCodes.map((someAirline) => ({
					key: someAirline.id,
					value: someAirline.name,
					props: {
						'data-bind': 'airline',
					},
				}))}
			/>
			<select class="select select-lg w-full" name="escalas" data-bind="escalas">
				{filtros.escalas.map((escala) => (
					<option key={escala.id} value={escala.id}>
						Escalas: {escala.name}
					</option>
				))}
			</select>
			<select class="select select-lg w-full" name="cabina" data-bind="cabina">
				{filtros.cabinas.map((cabina) => (
					<option key={cabina.id} value={cabina.id}>
						Cabina: {cabina.name}
					</option>
				))}
			</select>
		</>
	);
}
