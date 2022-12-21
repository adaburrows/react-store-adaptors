import { SyncExternalStoreApi } from './useStore';
import { Readable } from 'svelte/store';

/**
 * Wraps a Readable from Svelte to be used with useSyncExternalStore* hook
 *
 * This assumes the Readable<T>::subscribe() returns a unique object each time
 * it is called, because React relies on object identity (a === b) to determine
 * equivilency. If this becomes a problem we can clone the value each time this
 * is called.
 */
export function wrapSvelteReadable<T>(store: Readable<T>): SyncExternalStoreApi<T> {
  let snapshot: T;
  return {
    subscribe: function (cb: () => void) {
      return store.subscribe((value: T) => {
        snapshot = value;
        cb();
      })
    },
    getSnapshot: function (): T {
      return snapshot;
    }
  }
}