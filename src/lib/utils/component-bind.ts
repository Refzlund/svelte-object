import type { Writable } from 'svelte/store'
import { storeValue } from './store-value'
import { onDestroy } from 'svelte'
import type { Bind, StoreCallback } from './types'
import type { ValueStore } from 'svelte-object/value-store'

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
export function createBindFunction<T>(store: ValueStore<any> & { reset?: Function }) {
	let unsubs: (() => void)[] = []

	let lastItem: Bind<T, any> | undefined
	let lastFn: StoreCallback<T, any> | undefined
	function updateBind<K>(item: Bind<T, K> | undefined) {
		if (item === lastItem)
			return
		if (!item)
			return
		if (!('subscribe' in item) && !item?.[0])
			return
		
		const { getValue, setValue, store: bindStore, fn } = storeValue(item)
		
		/**
		 * This is checking in the case of  `<Component bind={[store, s => s[$someString]]}>`
		 * 
		 * That binding doesn't work (as of now) - and would otherwise crash the site.
		*/
		if (fn && fn?.toString() == lastFn?.toString())
			return

		for (let unsub of unsubs) {
			unsub()
			unsubs = []
		}

		lastFn = fn
		lastItem = item

		const parentValue = getValue()
		const startValue = typeof parentValue === 'undefined' ? store.initialValue : parentValue
		store.reset(startValue)
		setValue(startValue)

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