import { get } from 'svelte/store'
import { valueStore, type ValueStore } from '../value-store'
import type { ObjectStore } from './object-store'
import { proxifyArray } from './proxify-array'
import type { InferArray } from './types'
import { bind } from '$lib/bind'

type PartialOrT<T> = [T] extends [object] ? Partial<T> : T

export type ValueStoreArray<T extends Array<any>> = ObjectStore<T> & {
	push(item: PartialOrT<InferArray<T>>): number
	
	/** Returns the item that has been removed */
	removeByIndex(i: number): InferArray<T> | undefined
}

export default function valueStoreArray<T extends Array<any>>(initialValue: T): ValueStoreArray<T> {
	const store = valueStore(
		initialValue,
		() => function bindStore(node: Parameters<typeof bind>[0], property: string) {
			return bind(node, [store, s => s[property]])
		}
	) as ValueStoreArray<T>
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
	
	const setFunction = store.set
	const updateFunction = store.update

	// @ts-expect-error Read-only
	store.set = (value) => {
		proxifyArray(store, value)
		setFunction(value)
	}
	
	// @ts-expect-error Read-only
	store.update = (updater) => {
		return updateFunction((v: any) => {
			const result = updater?.(v)
			if (updater)
				proxifyArray(store, result)
			return result || get(store)
		})
	}
	
	return store
}