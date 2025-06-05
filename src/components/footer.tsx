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
			<a href="https://cafecito.app/mciparelli" rel="noreferrer" target="_blank">
				<img alt="Invitame un café en cafecito.app" src="https://cdn.cafecito.app/imgs/cafecito_logo.svg" class="w-10" />
			</a>
			<div class="flex gap-4">
				<a href="https://t.me/mciparelli" target="_blank" rel="noreferrer">
					<img alt="Telegram" src="https://www.svgrepo.com/show/452115/telegram.svg" class="w-6" />
				</a>
				<a href="https://x.com/mciparelli" target="_blank" rel="noreferrer" aria-label="Mi cuenta de X">
					<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-6 bi bi-twitter-x" viewBox="0 0 16 16">
						<path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
					</svg>
				</a>
			</div>
		</footer>
	);
}

export { Footer };
