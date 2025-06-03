function Region() {
	return (
		<form name="region1" class="region grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 px-2 text-primary">
			<input type="text" name="region_name" pattern="[a-zA-Z0-9_\-]{3,20}" placeholder="Region" class="input" />
			<input type="text" name="airport_name" pattern="[A-Z]{3}" placeholder="Aeropuerto 1" class="input" maxlength={3} />
			<input type="text" name="airport_name" pattern="[A-Z]{3}" placeholder="Aeropuerto 2" class="input" maxlength={3} />
			<input type="text" name="airport_name" pattern="[A-Z]{3}" placeholder="Aeropuerto 3" class="input" maxlength={3} />
			<input type="text" name="airport_name" pattern="[A-Z]{3}" placeholder="Aeropuerto 4" class="input" maxlength={3} />
			<input type="text" name="airport_name" pattern="[A-Z]{3}" placeholder="Aeropuerto 5" class="input" maxlength={3} />
			<input type="text" name="airport_name" pattern="[A-Z]{3}" placeholder="Aeropuerto 6" class="input" maxlength={3} />
			<input type="text" name="airport_name" pattern="[A-Z]{3}" placeholder="Aeropuerto 7" class="input" maxlength={3} />
			<input type="text" name="airport_name" pattern="[A-Z]{3}" placeholder="Aeropuerto 8" class="input" maxlength={3} />
			<input type="text" name="airport_name" pattern="[A-Z]{3}" placeholder="Aeropuerto 9" class="input" maxlength={3} />
			<input type="text" name="airport_name" pattern="[A-Z]{3}" placeholder="Aeropuerto 10" class="input" maxlength={3} />
		</form>
	);
}

export { Region };
