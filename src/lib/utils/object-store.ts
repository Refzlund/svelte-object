import { bind } from 'svelte-object/bind'
import type { ValueStore } from 'svelte-object/value-store'
import type { Bind } from './types'


export type ObjectStore<T> = ValueStore<T> & {
	(node: Parameters<typeof bind>[0], property: string | number | symbol): {
		destroy(): void
		update(item: Bind<any, T> | undefined): void
	}
}

export function createObjectStore<T>(store: ValueStore<T>) {
	function bindStore(node: Parameters<typeof bind>[0], property: string) {
		return bind(node, [store, s => s[property]])
	}

	for (const key of Object.keys(store))
		bindStore[key] = store[key]

	return bindStore as unknown as ObjectStore<T>
}