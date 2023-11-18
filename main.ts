/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import "$std/dotenv/load.ts";
import seed from "utils/seed.ts";

import { start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";
import config from "./fresh.config.ts";

await start(manifest, config);

Deno.cron("seed last day of calendar", "*/30 * * * *", async function () {
  const date = new Date();
  date.setDate(date.getDate() + 360);
  await seed(date);
});
