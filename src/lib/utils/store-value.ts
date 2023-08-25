import { get, type Writable } from 'svelte/store'
import type { Bind, StoreCallback } from './types'
import { assertIsWritable, objectFromId } from './svelte-object'



/** 
 * Format: `storeValue([store, storeCallback])` or `storeValue(store)`
 
 * @example const { getValue, setValue } = storeValue([store, s => s.address.streetname])
 * @example const { getValue, setvalue } = storeValue(store)
*/
export function storeValue<T, K>(item: Bind<T, K>) {
	item = objectFromId(item)

	let store = 'set' in item ? item : item[0]
	const fn: StoreCallback<T, K> | undefined = item[1]
	const keys: string[] = []
	const proxy = new Proxy({} as Record<any, any>, {
		get(target, prop: string) {
			keys.push(prop)
			return proxy
		}
	})
	fn?.(proxy)
	const key = keys.pop() as string

	function getValue() {
		let value: any = get(store as any)
		if (!fn || !value)
			return value
		let obj = value
		for (let key of keys) {
			if (!obj[key])
				return undefined
			obj = obj[key]
		}
		return obj[key]
	}

	function setValue(value: [K] extends [never] ? T : K) {
		assertIsWritable(store)

		if (!fn) {
			store.set(value as any)
			return
		}
		store.update(v => {
			let obj = v
			if (!obj)
				return v
			for (let key of keys) {
				if (!obj[key]) {
					if (Array.isArray(obj)) {
						/* 
							We do not intialize the key for array items
							as the item has to "exist" within the array
							regardless.
	
							If we were to initialize the key for an array item,
							it would result in buggy-behaviour when trying to
							remove this item.
						*/
						return v
					}

					obj[key] = {}
				}
				obj = obj[key]
			}
			obj[key] = value
			return v
		})
	}
	
	assertIsWritable(store)
	return {
		getValue, setValue, store, fn
	}
}