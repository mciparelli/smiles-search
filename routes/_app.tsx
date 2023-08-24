import { AppProps } from "$fresh/server.ts";
import Footer from "islands/footer.jsx";

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
