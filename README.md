# React Store Adaptors

Allows adapting different kinds of stores, including Svelte `Readable<T>`s and simply adapting them for use in a React application that automatically dispatches updates to the UI.

For example, using the [Holochain profile module](https://github.com/holochain-open-dev/profiles) is a simple as this:

```ts
import { wrapSvelteReadable, useStore } from "react-store-adaptors";
import { Profile, ProfilesService, ProfilesStore } from "@holochain-open-dev/profiles";

const profilesStore = await connectProfiles();
const myProfileReadable = await profilesStore.fetchMyProfile();
const profile = useStore<Profile>(wrapSvelteReadable(myProfileReadable));
```

If the `Readable<T>` updates, it will dispatch to the React useSyncExternalStore event listener.

This entire module is only about 36 lines of code excluding comments and whitespace.

## How it works

The `useSyncExternalStore` provides a very basic bare bones interface for data stores to interface with React.

This interface is exposed in this library as [`SyncExternalStoreApi<Snapshot>`](https://github.com/adaburrows/react-store-adaptors/blob/main/src/useStore.ts#L20).

The bare minimum each adaptor has to implement are the methods:
* `subscribe(): () => void`
* `getSnapshot(): Snapshot`

The `subscribe()` method needs to return an unsubscribe function that does the opposite of the `subscribe()` method.

The `getSnapshot()` method needs to return the current value of the store.

For the simplest possible example of implementing an adaptor, please see [src/wrapSvelteReadable.ts](https://github.com/adaburrows/react-store-adaptors/blob/main/src/wrapSvelteReadable.ts).
