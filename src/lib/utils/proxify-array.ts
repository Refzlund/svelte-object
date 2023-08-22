import type { SvelteArray } from 'svelte-object/components/Array.svelte'
import type { ValueStoreArray } from './value-store-array'
import type { InferArray } from './types'

const proxiedArray = Symbol('svelte-array')
function proxyUpdate<T extends Array<unknown>>(store, v: SvelteArray<InferArray<T>>, ...keys: string[]) {
	type O = InferArray<T>

	if (!v || v[proxiedArray])
		return v as SvelteArray<O>
	v[proxiedArray] = true
	v.removeByIndex = (index: number) => store.removeByIndex(index) as O
	for (const key of keys) {
		const fn = v[key]
		v[key] = function (...args: unknown[]) {
			const result = fn.call(v, ...args)
			store.update()
			return result
		}
	}
	return v as SvelteArray<O>
}

export function proxifyArray<T extends Array<unknown>>(store: ValueStoreArray<any>, v: SvelteArray<InferArray<T>> | undefined | T | never[]) {
	return proxyUpdate(
		store,
		v as SvelteArray<InferArray<T>>,
		'push', 'pop', 'shift', 'unshift', 'splice', 'reverse', 'sort', 'fill', 'copyWithin', 'flat'
	)
}