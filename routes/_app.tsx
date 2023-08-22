import { AppProps } from "$fresh/server.ts";
import Footer from "islands/footer.jsx";

export default function App({ Component }: AppProps) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Smiles Search</title>
      </head>
      <body class="bg-gray-200 min-h-[100vh] flex flex-col">
        <Component />
        <Footer />
      </body>
    </html>
  );
}
