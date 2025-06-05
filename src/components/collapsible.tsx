export function Collapsible({ class: className = '', containerClass = '', title, children }) {
	return (
		<details class={`collapse collapse-arrow group open:pb-2 ${containerClass}`}>
			<summary class="collapse-title font-bold text-lg">{title}</summary>
			<div class={`flex flex-col px-2 ${className}`}>{children}</div>
		</details>
	);
}
