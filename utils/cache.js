const kv = await Deno.openKv(Deno.env.get("DB_URL"));
async function set(key, value) {
  await kv.set([key], value);
}

async function get(key) {
  const { value } = await kv.get([key]);
  return value;
}

async function remove(key) {
  await kv.delete([key]);
}

export { get, remove, set };
