import { useDebugValue } from 'react';
import useSyncExternalStoreExports from 'use-sync-external-store/shim';
import useSyncExternalStoreWithSelectorExports from 'use-sync-external-store/shim/with-selector';
const { useSyncExternalStore } = useSyncExternalStoreExports;
const { useSyncExternalStoreWithSelector } = useSyncExternalStoreWithSelectorExports;

/*
 * This uses the React v18 compatible shim for synchronous updates. Here's a
 * useful article:
 *  - https://blog.saeloun.com/2021/12/30/react-18-usesyncexternalstore-api
 * React documentation:
 *  - https://reactjs.org/docs/hooks-reference.html#usesyncexternalstore
 * Also, there is useful conversation on GitHub here:
 *  - https://github.com/reactwg/react-18/discussions/86
 */

/**
 * Interface for compatibility with React useSyncExternalStore
 */
export interface SyncExternalStoreApi<Snapshot> {
  // takes a callback function and returns an unsubscribe function
  subscribe: (_: () => void) => () => void;
  // returns the current snapshot of the data
  getSnapshot: () => Snapshot;
  getServerSnapshot?: () => Snapshot;
};

/**
 * useStore React hook:
 * Takes an adapted store (an object with the interface SyncExternalStoreApi),
 * and returns the current snapshot for use in the API. It also triggers
 * rerendering when the data changes.
 */
export function useStore<Snapshot>(
  store: SyncExternalStoreApi<Snapshot>
): Snapshot {
  const state = useSyncExternalStore<Snapshot>(
    // Subscriber function
    store.subscribe,
    // Client side data snapshot
    store.getSnapshot,
    // Server side data snapshot
    store.getServerSnapshot ? store.getServerSnapshot : store.getSnapshot
  )
  useDebugValue(state);
  return state;
}

/**
 * useStoreWithSelector React hook:
 * Takes an adapted store (an object with the interface SyncExternalStoreApi) and
 * a selector that returns a portion of the store to compare against.
 * and returns the current snapshot for use in the API. It also triggers
 * rerendering when the data changes.
 */
export function useStoreWithSelector<Snapshot, Selection>(
  store: SyncExternalStoreApi<Snapshot>,
  selector: (snapshot: Snapshot) => Selection
): Selection {
  const state = useSyncExternalStoreWithSelector<Snapshot>(
    // Subscriber function
    store.subscribe,
    // Client side data snapshot
    store.getSnapshot,
    // Server side data snapshot
    store.getServerSnapshot ? store.getServerSnapshot : store.getSnapshot,
    // Selector function traverses the structure to get to the wanted data
    selector
  )
  useDebugValue(state);
  return state;
}
