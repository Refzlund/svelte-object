import { onDestroy } from 'svelte'
import { writable, type Writable } from 'svelte/store'

export default class LinkedStore<T> {
	store: Writable<T>
	updateMethod: (newValue: T) => void
	
	constructor(initialValue: T, updateMethod: (newValue: T) => void ) {
		this.store = writable(initialValue)
		onDestroy(this.store.subscribe(v => this.reactivity(v, true)))
		this.updateMethod = updateMethod
	}

	set: Writable<T>['set'] = (...args) => this.store.set(...args)
	update: Writable<T>['update'] = (...args) => this.store.update(...args)
	subscribe: Writable<T>['subscribe'] = (...args) => this.store.subscribe(...args)

	reactivity(v: T, storeUpdate = false) {
		if (!storeUpdate)
			this.store.set(v)
		else
			this.updateMethod?.apply(this, [v])
	}
}