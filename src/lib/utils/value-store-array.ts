import { valueStore, type ValueStore } from '../value-store'

type InferArray<T extends Array<any>> = T extends Array<infer K> ? K : never
type ValueStoreArray<T extends Array<any>> = ValueStore<T> & {
	push(item: Partial<InferArray<T>>): number
	removeByIndex(i: number): InferArray<T> | undefined
}

export default function valueStoreArray<T extends Array<any>>(initialValue: T): ValueStoreArray<T> {
	const store = valueStore(initialValue)

	return {
		...store,
		push(item) {
			let length = -1
			store.update(v => {
				v ??= [] as InferArray<T> 
				v.push(item)
				length = v.length
				return v
			})
			return length
		},
		removeByIndex(i) {
			let item: InferArray<T> | undefined
			store.update(v => {
				v ??= [] as InferArray<T> 
				item = v[i]
				return [...v.slice(0, i), ...v.slice(i + 1)] as T
			})
			return item
		}
	}
}