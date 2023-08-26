import { bind } from 'svelte-object/bind'
import type { ValueStore } from 'svelte-object/value-store'

export type ObjectStore<T> = ValueStore<T> & 
	((node: Parameters<typeof bind>[0], property: string | number | symbol) => ReturnType<typeof bind>)


export function createObjectStore<T>(store: ValueStore<T>) {
	function bindStore(node: Parameters<typeof bind>[0], property: string) {
		return bind(node, [store, s => s[property]])
	}

	for (const key of Object.keys(store))
		bindStore[key] = store[key]

	return bindStore as unknown as ObjectStore<T>
}