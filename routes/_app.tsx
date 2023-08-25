import { AppProps } from "$fresh/server.ts";
import Footer from "islands/footer.jsx";
import posthog from 'posthog-js'

const isDenoDeploy = Deno.env.get("DENO_DEPLOYMENT_ID") !== undefined;
if (isDenoDeploy) {
  posthog.init('phc_RBB3bPLpJcDSIHYpo1JI4m8hmy1zXIVLvZLc0O3ZVpN', { api_host: 'https://app.posthog.com' })
}

export default function App({ Component }: AppProps) {
  return (
    <html class="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Smiles Search</title>
      </head>
      <body class="bg-gray-200 h-full flex flex-col">
        <Component />
        <Footer />
      </body>
    </html>
  );
}
