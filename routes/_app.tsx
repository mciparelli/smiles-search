import { AppProps } from "$fresh/server.ts";
import Footer from "islands/footer.jsx";

const isDenoDeploy = Deno.env.get("DENO_DEPLOYMENT_ID") !== undefined;

export default function App({ Component }: AppProps) {
  return (
    <html class="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Smiles Search</title>
        {/* matomo */}
        {isDenoDeploy ? <script dangerouslySetInnerHTML={{
          __html: `var _paq = window._paq = window._paq || [];
          /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
          _paq.push(['trackPageView']);
          _paq.push(['enableLinkTracking']);
          (function() {
            var u="https://smiles-search.matomo.cloud/";
          _paq.push(['setTrackerUrl', u+'matomo.php']);
          _paq.push(['setSiteId', '1']);
          var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
          g.async=true; g.src='//cdn.matomo.cloud/smiles-search.matomo.cloud/matomo.js'; s.parentNode.insertBefore(g,s);
          })();`}} /> : null}
      </head>
      <body class="bg-gray-200 h-full flex flex-col">
        <Component />
        <Footer />
      </body>
    </html>
  );
}
