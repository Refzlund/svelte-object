import { get } from 'svelte/store'
import { valueStore, type ValueStore } from '../value-store'
import { createObjectStore, type ObjectStore } from './object-store'
import { proxifyArray } from './proxify-array'
import type { InferArray } from './types'

type PartialOrT<T> = [T] extends [object] ? Partial<T> : T

export type ValueStoreArray<T extends Array<any>> = ObjectStore<T> & {
	push(item: PartialOrT<InferArray<T>>): number
	
	/** Returns the item that has been removed */
	removeByIndex(i: number): InferArray<T> | undefined
}

export default function valueStoreArray<T extends Array<any>>(initialValue: T): ValueStoreArray<T> {
	const store = createObjectStore(valueStore(initialValue)) as ValueStoreArray<T> 
	proxifyArray(store, get(store))

	store.push = function push(item) {
		let length = -1
		store.update(v => {
			v ??= [] as InferArray<T>
			v.push(item)
			length = v.length
			return v
		})
		return length
	}
	store.removeByIndex = function removeByIndex(i) {
		let item: InferArray<T> | undefined
		store.update(v => {
			v ??= proxifyArray(store, []) as InferArray<T>
			item = v.splice(i, 1)[0]
			return v as T
		})
		
		return item
	}
	
	return store
}