import { get, type Writable } from 'svelte/store'
import type { InputType } from 'svorms'

export default function typeAction(node: HTMLInputElement, [store, type]: [Writable<any>, InputType]) {
	node.type = type
	return {
		update([store, newType]) {
			let val = get(store)
			node.type = newType
			if (newType === 'number') {
				store.set(parseFloat(val as string))
			}
		}
	}
}