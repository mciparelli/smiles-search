import { html } from 'hono/html';
import { Footer } from './footer';

function LoadLink({ href }) {
	return (
		<>
			<link rel="preload" href={href} as="style" onload="this.onload=null;this.rel='stylesheet'" />
			<noscript>
				<link rel="stylesheet" href={href} />
			</noscript>
		</>
	);
}

function Layout({ children }) {
	return (
		<html lang="en" class="h-full" data-theme="emerald">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta name="description" content="smiles-search.app es un sitio que te facilita las búsquedas para tus compras en smiles.com.ar" />
				<meta name="keywords" content="smiles, smiles-search, compras, smiles.com.ar, búsqueda, millas, ofertas" />
				<meta name="author" content="Martín Ciparelli" />
				<title>Smiles Search</title>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
				<LoadLink href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap" />
				<LoadLink href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" />
				<link rel="stylesheet" href="output.css" />
				<link rel="icon" type="image/svg+xml" href="glass.svg" />
				<script defer src="/client.js" />
				<script defer type="module" src="https://cdn.jsdelivr.net/gh/starfederation/datastar@1.0.0-beta.11/bundles/datastar.js" />
				{html`<script defer>
					!(function (t, e) {
						var o, n, p, r;
						e.__SV ||
							((window.posthog = e),
							(e._i = []),
							(e.init = function (i, s, a) {
								function g(t, e) {
									var o = e.split('.');
									2 == o.length && ((t = t[o[0]]), (e = o[1])),
										(t[e] = function () {
											t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
										});
								}
								((p = t.createElement('script')).type = 'text/javascript'),
									(p.async = !0),
									(p.src = s.api_host + '/static/array.js'),
									(r = t.getElementsByTagName('script')[0]).parentNode.insertBefore(p, r);
								var u = e;
								for (
									void 0 !== a ? (u = e[a] = []) : (a = 'posthog'),
										u.people = u.people || [],
										u.toString = function (t) {
											var e = 'posthog';
											return 'posthog' !== a && (e += '.' + a), t || (e += ' (stub)'), e;
										},
										u.people.toString = function () {
											return u.toString(1) + '.people (stub)';
										},
										o =
											'capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys'.split(
												' ',
											),
										n = 0;
									n < o.length;
									n++
								)
									g(u, o[n]);
								e._i.push([i, s, a]);
							}),
							(e.__SV = 1));
					})(document, window.posthog || []);
					posthog.init('phc_RBB3bPLpJcDSIHYpo1JI4m8hmy1zXIVLvZLc0O3ZVpN', { api_host: 'https://app.posthog.com' });
				</script>`}
			</head>
			<body class="bg-base-100 h-full flex flex-col font-[Open_Sans]" data-signals-request-controller="">
				<div class="p-4 gap-4 flex flex-col flex-grow-[1] cloak" data-class="{cloak:false}">
					<div class="flex gap-1">
						<img src="glass.svg" alt="Smiles Search" class="w-18 h-18 self-start" />
						<div class="font-[Montserrat] self-center">
							<div class="text-lg/5 font-bold">smiles-</div>
							<div class="text-lg/5 font-bold">search</div>
							<div class="text-sm/5">.app</div>
						</div>
					</div>
					{children}
				</div>
				<Footer />
			</body>
		</html>
	);
}

export { Layout };
