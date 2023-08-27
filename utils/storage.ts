// https://twitter.com/_developit/status/1692546035321545043?s=20
import { effect, signal } from "@preact/signals";

interface CustomStorage {
  getItem(key: string): void;
  setItem(key: string, value: string | null): void;
}

/**
 * A version of signal() that persists and recalls its value in localStorage.
 * @example
 *   const db = persistedSignal({}, 'db');
 *   db.value = {...db.value, newKey: 1});  // saves to localStorage.db
 *
 *   // in a new page/tab/JS context:
 *   const db = persistedSignal({}, 'db');
 *   db.value.newKey; // 1  (loaded from localStoage.db)
 */
function persistedSignal<T>(
  initialValue: T,
  key: string,
  storage: Storage | CustomStorage = localStorage,
) {
  const sig = signal(initialValue);
  let skipSave = true;

  // try to hydrate state from storage:
  function load() {
    skipSave = true;
    try {
      const stored = JSON.parse(storage.getItem(key));
      if (stored != null) sig.value = stored;
    } catch (_err) {
      // ignore blocked storage access
    }
    skipSave = false;
  }

  effect(() => {
    const value = sig.value;
    if (skipSave) return;
    try {
      storage.setItem(key, JSON.stringify(value));
    } catch (_err) {
      // ignore blocked storage access
    }
  });

  // if another tab changes the launch tracking state, update our in-memory copy:
  if (typeof addEventListener === "function") {
    addEventListener("storage", (ev) => {
      if (ev.key === key) load();
    });
  }

  load();
  return sig;
}

export { persistedSignal };
