export { bind } from './bind'
export { valueStore } from './value-store'

export { default as Object } from './components/Object.svelte'
export { default as Array } from './components/Array.svelte'

export type { SvelteArray } from './components/Array.svelte'
export type { ObjectStore } from './utils/object-store'

export { getParentObject, getParentStore } from './get-parent-object'

export { proxifyArray } from './utils/proxify-array'

import type { ComponentProps } from 'svelte'
import Value from './components/Value.svelte'

export type { ValueStore, ValueStoreContent } from './value-store'
export type ValueProps<T, K> = Omit<ComponentProps<Value<T, K>>, 'store'>

export { Value }