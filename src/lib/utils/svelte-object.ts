import { onDestroy, setContext, tick } from 'svelte'
import type { ValueStore } from '../value-store'
import { get, writable, type Unsubscriber, type Writable } from 'svelte/store'

export type SvelteObject = Readonly<{
	stores: ValueStore<any>[]
	/** These are the attributes passed to this object which cascades to child Objects and Arrays*/
	$$restProps: Writable<Record<any, any>>
	/** These attributes is the combined attributes, and should not be written to */
	attributes: { subscribe: Writable<Record<any, any>>['subscribe'] }
	addValueStore(incoming: ValueStore<any>): void
	removeValueStore(incoming: ValueStore<any>): void
}>

export function svelteObject(store: ValueStore<Record<any, any>>): SvelteObject {
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
		stores: [],
		$$restProps: $$restProps,
		attributes: { subscribe: attributes.subscribe },
		addValueStore(incoming: ValueStore<any>) {
			obj.removeValueStore(incoming)
			if (typeof incoming.name === 'undefined')
				return

			const existing = get<any>(store)[incoming.name]
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
					obj[incoming.name as string] = v
					return obj
				})
			})
			const objectUnsub = store.subscribe(v => {
				if (Array.isArray(v)) {
					if (Number(incoming.name) >= v.length)
						return
				}
				if (typeof get(incoming) === 'object') {
					recursive = true
					tick().then(v => recursive = false)
				}
				
				incoming.set(v?.[incoming.name as string])
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
		}
	}

	onDestroy(() => {
		for (const store of obj.stores)
			for (const unsub of unsubs.get(store) || [])
				unsub()
		for (const unsub of unsubs.get(symbol) || [])
			unsub()
	})

	setContext('svelte-object', obj)
	return obj
}