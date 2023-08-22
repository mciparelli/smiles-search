import FormAndResults from "islands/form-and-results.jsx";

export default function Home({ url }) {
  return (
    <FormAndResults
      params={Object.fromEntries(new URLSearchParams(url.search))}
    />
  );
}
