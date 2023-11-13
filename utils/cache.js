import { createClient } from '@libsql/client';
import "$std/dotenv/load.ts";

const client = createClient({
  url: Deno.env.get('DB_URL'),
  authToken: Deno.env.get('DB_AUTH_TOKEN')
});

export default function makeCache(prefix) {
  return {
      async set(key, value) {
        await client.execute({
            sql: "insert into cache values (:key, :value)",
            args: { key: prefix + ':' + key, value: JSON.stringify(value) }
        });
      },
      async get(key) {
        const { rows: [cacheRow]} = await client.execute({
          sql: 'select value from cache where key = :key',
          args: { key: prefix + ':' + key }
        });
        if (!cacheRow) return null;
        return JSON.parse(cacheRow.value)
      },
      async delete(key) {
          await client.execute({
          sql: 'delete from cache where key = :key',
          args: { key: prefix + ':' + key }
        });
      }
    };
}