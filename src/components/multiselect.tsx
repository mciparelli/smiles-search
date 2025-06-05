export function Multiselect({ name, title, options, ...props }) {
	return (
		<div class="relative w-full" {...props}>
			<input type="checkbox" id={`multiselect-${name}`} class="peer hidden" />
			<label
				htmlFor={`multiselect-${name}`}
				data-text={title}
				class="justify-start font-normal btn btn-lg bg-base-100 w-full rounded-md peer-checked:rounded-b-none transition-all duration-200 focus:outline-none focus-visible:ring focus-visible:ring-opacity-75 focus-visible:ring-primary"
				style="
				padding-inline-start: calc(0.25rem * 4);
    		padding-inline-end: calc(0.25rem * 7);"
			/>
			<ul class="menu bg-base-100 shadow-sm absolute left-0 top-full w-full z-50 opacity-0 invisible peer-checked:opacity-100 peer-checked:visible transform -translate-y-1 peer-checked:translate-y-0 transition-all duration-200 rounded-b-md rounded-t-none border-t-0">
				{options.map((option, index) => (
					<li key={index}>
						<label class="label text-lg">
							<input type="checkbox" class="checkbox text-primary" name={name} value={option.key} {...option.props} />
							{option.value}
						</label>
					</li>
				))}
			</ul>
			<label htmlFor={`multiselect-${name}`} class="fixed inset-0 bg-transparent cursor-default peer-checked:block hidden z-40"></label>
		</div>
	);
}
