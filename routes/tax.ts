import { Handlers } from "$fresh/server.ts";
import pThrottle from "p-throttle";

const throttle = pThrottle({
  limit: 3,
  interval: 1000,
});

let throttledSearch = throttle((queryString) => {
  return fetch(Deno.env.get("TAX_URL") + "/flight/boardingtax?" + queryString, {
    headers: {
      authorization: "Bearer " + Deno.env.get("AUTH_TOKEN"),
      "x-api-key": Deno.env.get("API_KEY"),
      "Content-Type": "application/json",
      Accept: "*/*",
      region: "ARGENTINA",
    },
  });
});

export const handler: Handlers = {
  GET(request) {
    let url = new URL(request.url);
    return throttledSearch(url.searchParams.toString());
  },
};
