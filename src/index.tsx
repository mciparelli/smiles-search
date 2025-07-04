import { Hono } from 'hono';
import { html } from 'hono/html';
import { validator } from 'hono/validator';
import { serveStatic } from 'hono/cloudflare-workers';
import { ServerSentEventGenerator } from '@starfederation/datastar-sdk/web';
import { Layout } from '@components/layout';
import { Region } from '@components/region';
import { SearchForm } from '@components/search-form';
import { streamResults } from './flight-utils';
import { Collapsible } from '@components/collapsible';
import { cache } from 'hono/cache';

const app = new Hono<{ Bindings: CloudflareBindings }>();

// Serve static files from the public directory
app.get('/static/*', serveStatic({ root: './' }));

// Serve CSS files directly from public directory
app.get('/output.css', serveStatic({ path: './public/output.css' }));

app.get(
	'/tax',
	cache({
		cacheName: 'search',
		cacheControl: 'max-age=3600, stale-while-revalidate=86400, stale-if-error=604800', // max-age=3600 is 1 hour, stale-while-revalidate=86400 is 24 hours, stale-if-error=604800 is 7 days
	}),
	(c) => {
		return ServerSentEventGenerator.stream(
			async (stream) => {
				let params = { uid: c.req.query('uid'), fareuid: c.req.query('fareuid') };
				let taxData = await c.env.API.searchTax(params);
				if (taxData.errorMessage) {
					stream.mergeFragments(`<div class="text-gray-700" id="tax-${params.uid}-${params.fareuid}">?</div>`);
				} else {
					let {
						totals: {
							totalBoardingTax: { money: moneyTax },
						},
					} = taxData;

					stream.mergeFragments(
						`<div class="text-gray-700" id="tax-${params.uid}-${params.fareuid}">$${Math.floor(moneyTax / 1000)}K</div>`,
					);
				}
			},
			{
				onError(error) {
					console.error(error);
				},
			},
		);
	},
);

app.post(
	'/search',
	validator('json', function (value, c) {
		if (typeof value['award'] !== 'boolean') return c.text('Wrong award format', 400);
		if (typeof value['cabina'] !== 'string') return c.text('Wrong cabina format', 400);
		if (!Array.isArray(value['origin'])) return c.text('Wrong origin format', 400);
		if (!Array.isArray(value['destination'])) return c.text('Wrong destination format', 400);
		if (!Array.isArray(value['date'])) return c.text('Wrong date format', 400);
		if (typeof value['escalas'] !== 'string') return c.text('Wrong escalas format', 400);
		if (typeof value['onlyGol'] !== 'boolean') return c.text('Wrong onlyGol format', 400);
		// if (typeof value['smilesAndMoney'] !== 'boolean') return c.text('Wrong smilesAndMoney format', 400);
		// if (typeof value['viajeFacil'] !== 'boolean') return c.text('Wrong viajeFacil format', 400);
		return true;
	}),
	async function (c) {
		return ServerSentEventGenerator.stream(
			async (stream) => {
				await streamResults({ c, stream });
			},
			{
				onError(error) {
					console.error(error);
				},
			},
		);
	},
);

app.get('/', (c) => {
	return c.html(
		html`<!doctype html>` +
		(
			<Layout>
				<Collapsible title="Regiones" class="gap-2" containerClass="bg-primary text-primary-content font-bold">
					<Region />
				</Collapsible>
				<SearchForm />
				<div id="results-wrapper" class="m-auto flex flex-col items-center">
					<p class="text-base-content font-medium">Elija un origen, un destino y una fecha para buscar.</p>
				</div>
			</Layout>
		),
	);
});

export default app;
