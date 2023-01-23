import type { Writable } from 'svelte/store'
import { storeValue } from './store-value'
import { onDestroy } from 'svelte'
import type { Bind, StoreCallback } from './types'

/**
 * ### Usage - Component Internals
 * ```
 * // Store containing a string
 * type T = string | undefined
 * export const store = valueStore<T>(undefined)
 *
 * // Store containing an object
 * type T = $$Generic<Record<any, any>>
 * export const store = valueStore<T>({})
 * 
 * const updateBind = createBindFunction(store)
 * export let bind: Bind
 * $: updateBind(bind)
 * ```
 *  
 * ### Usage - Component
 * ```
 * // Bind directly to a store of type T
 * <Component bind={store} />
 * 
 * // Bind to a stores nested value
 * <Component bind={[store, store => store.nested.item]} />
 * ```
*/
export function createBindFunction<T, K>(store: Writable<any>) {
	let unsubs: (() => void)[] = []

	let lastItem: Bind<T, K> | undefined
	let lastFn: StoreCallback<T, K> | undefined
	function updateBind(item: Bind<T, K> | undefined) {
		if(item === lastItem) return
		for (let unsub of unsubs) {
			unsub()
			unsubs = []
		}
		if (!item)
			return
		
		const { getValue, setValue, store: bindStore, fn } = storeValue(item)
		if (fn?.toString() == lastFn?.toString())
			return

		lastFn = fn
		lastItem = item

		store.set(getValue())
		let recursive = false
		const bindUnsub = bindStore.subscribe(v => {
			const value = getValue()
			if (typeof value === 'object') {
				recursive = true
				setTimeout(() => recursive = false, 0)
			}
			store.set(value)
		})
		const storeUnsub = store.subscribe(v => {
			if (recursive)
				return
			setValue(v)
		})
		unsubs.push(bindUnsub, storeUnsub)
	}

	onDestroy(() => {
		for (let unsub of unsubs) {
			unsub()
			unsubs = []
		}
	})

	return updateBind
}