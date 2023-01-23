import { get } from 'svelte/store'
import type { Bind, StoreCallback } from './types'



/** 
 * Format: `storeValue([store, storeCallback])` or `storeValue(store)`
 
 * @example const { getValue, setValue } = storeValue([store, s => s.address.streetname])
 * @example const { getValue, setvalue } = storeValue(store)
*/
export function storeValue<T, K>(item: Bind<T, K>) {
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
					obj[key] = {}
				}
				obj = obj[key]
			}
			obj[key] = value
			return v
		})
	}

	return {
		getValue, setValue, store, fn
	}
}