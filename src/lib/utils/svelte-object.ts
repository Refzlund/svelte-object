import { getContext, onDestroy, setContext, tick } from 'svelte'
import type { ValueStore } from '../value-store'
import { get, writable, type Unsubscriber, type Writable } from 'svelte/store'
import type { Bind, StoreCallback } from './types'

export type SvelteObject = Readonly<{
	id: string | number | symbol | undefined
	store: ValueStore<Record<any, any>>
	stores: ValueStore<any>[]
	/** These are the attributes passed to this object which cascades to child Objects and Arrays*/
	$$restProps: Writable<Record<any, any>>
	/** These attributes is the combined attributes, and should not be written to */
	attributes: { subscribe: Writable<Record<any, any>>['subscribe'] }
	addValueStore(incoming: ValueStore<any>): void
	removeValueStore(incoming: ValueStore<any>): void
	setId(id: string | number | symbol | undefined): void
}>

export function objectFromId(item: Bind<any, any>) {
	let value = item as Writable<any> | [Writable<any>, StoreCallback<any, any>]
	if (typeof item === 'string' || typeof item[0] === 'string') {
		const isArray = typeof item === 'object'
		const id = isArray ? item[0] : item
		const obj = getContext(`svelte-object[${id}]`) as SvelteObject
		if(!obj)
			throw new Error(`Could not find svelte-object with the id of "${id}"`)
		if (isArray)
			value[0] = obj.store as Writable<any>
		else
			value = obj.store as Writable<any>
	}
	return value
}

export function assertIsWritable(item: any): asserts item is Writable<any> {
	if ('subscribe' in item)
		return
	throw new TypeError('Item is now a writable')
}

export function svelteObject(store: ValueStore<Record<any, any>>, ignore = false): SvelteObject {
	/** Recursive attributes */
	const $$restProps = writable({})
	const attributes = writable({})

	/** We're using a weakmap to have objects as keys to the unsubscribe functions */
	const unsubs: WeakMap<any, Unsubscriber[]> = new WeakMap()
	const symbol = {}

	if (store.parent) {
		const parentAttributes = store.parent.attributes
		const updater = () => attributes.set({ ...get(parentAttributes as any), ...get($$restProps) })
		const unsub1 = parentAttributes.subscribe(updater)
		const unsub2 = $$restProps.subscribe(updater)
		unsubs.set(symbol, [unsub1, unsub2]) 
	}
	else {
		const unsub = $$restProps.subscribe(a => attributes.set(a))
		unsubs.set(symbol, [unsub])
	}

	const obj: SvelteObject = {
		id: undefined,
		store,
		stores: [],
		$$restProps: $$restProps,
		attributes: { subscribe: attributes.subscribe },
		addValueStore(incoming: ValueStore<any>) {
			obj.removeValueStore(incoming)
			if (typeof incoming.propertyName === 'undefined')
				return

			const existing = get<any>(store)[incoming.propertyName]
			const types = {
				existing: typeof existing,
				incoming: typeof get(incoming)
			}
			
			if (existing) {
				const hasObject = types.incoming === 'object' || types.existing === 'object'
				const hasNonObject = types.incoming !== 'object' || types.existing !== 'object'
				
				if ((hasObject && !hasNonObject) || !hasObject)
					incoming.reset(existing)
			}
			else
				incoming.reset(incoming.initialValue)

			let recursive = false
			const incomingUnsub = incoming.subscribe(v => {
				if (recursive)
					return
				store.update(obj => {
					obj[incoming.propertyName as string] = v
					return obj
				})
			})
			const objectUnsub = store.subscribe(v => {
				if (Array.isArray(v)) {
					if (Number(incoming.propertyName) >= v.length)
						return
				}
				if (typeof get(incoming) === 'object') {
					recursive = true
					tick().then(v => recursive = false)
				}
				
				incoming.set(v?.[incoming.propertyName as string])
			})

			obj.stores.push(incoming)
			unsubs.set(incoming, [incomingUnsub, objectUnsub])
		},
		removeValueStore(incoming) {
			const index = obj.stores.indexOf(incoming)
			if (index === -1)
				return
			for (const unsub of unsubs.get(incoming) || []) {
				// * "stop() is not a function"-error from Svelte store - not sure why it happens
				try {
					unsub()
				} catch (error) { }
			}

			unsubs.delete(incoming)
			// @ts-expect-error Cannot assign to 'stores' because it is a read - only property.ts(2540)
			obj.stores = [...obj.stores.slice(0, index), ...obj.stores.slice(index + 1)]
		},
		setId(id) {
			if (obj.id !== undefined)
				setContext(`svelte-object[${obj.id.toString()}]`, undefined)
			if (id === undefined)
				return
			// @ts-expect-error
			obj.id = id
			setContext(`svelte-object[${id.toString()}]`, obj)
		},
	}

	onDestroy(() => {
		for (const store of obj.stores)
			for (const unsub of unsubs.get(store) || [])
				unsub()
		for (const unsub of unsubs.get(symbol) || [])
			unsub()
	})

	if(!ignore)
		setContext('svelte-object', obj)
	return obj
}