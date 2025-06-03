function Link({ children, href }) {
	return (
		<a class="text-primary-500" target="_blank" rel="noreferrer" href={href}>
			{children}
		</a>
	);
}

function Footer() {
	return (
		<footer class="px-4 py-2 gap-4 w-full text-xs italic flex justify-between items-end">
			<a href="https://github.com/mciparelli/smiles-search/tree/workers" target="_blank" rel="noreferrer" class="flex-shrink-0">
				<img
					alt="Github"
					width={36}
					src="https://gist.githubusercontent.com/eyecatchup/8928ba7f42b6cbc5d8f76cbbf3bb2316/raw/df7220127bb6275c5ad66b5c9377c63dce22c81d/github-mark.svg"
				/>
			</a>
		</footer>
	);
}

export { Footer };
