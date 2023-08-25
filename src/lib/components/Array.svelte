<script context='module' lang='ts'>
	export type SvelteArray<T extends unknown = unknown> = T[] & { 
		/** Returns the item that has been removed */
		removeByIndex(i: number): T
		push(item: Partial<T>): number
	}
</script>

<script lang='ts'>
	import { proxifyArray } from 'svelte-object/utils/proxify-array'

	import { createBindFunction } from '$lib/utils/component-bind'
	import onValidate from '$lib/utils/object-onValidate'
	import { svelteObject } from '$lib/utils/svelte-object'
	import type { Bind, InferArray } from '$lib/utils/types'
	import valueStoreArray from '$lib/utils/value-store-array'

	type T = $$Generic<Array<unknown>>
	type O = InferArray<T>
	type K = $$Generic
	type P = $$Generic<string>

	
	


	/** Initial value */
	export let value: T | undefined = undefined
	export const store = valueStoreArray<SvelteArray<O>>(value || [] as any)
	
	export let 
		name: string | number | undefined = undefined,
		bind: Bind<SvelteArray<O>, K> | undefined = undefined,
		id: string | undefined = undefined

	store.prechange = v => {
		if(!v) {
			let arr = [] as unknown[] as SvelteArray<O>
			proxifyArray(store, arr)
			return arr
		}
		if(typeof v !== 'object')
			v = $store

		proxifyArray(store, v)
		return v
	}
	store.setName(name)

	const obj = svelteObject(store as any)
	$: obj.$$restProps.set($$restProps as any)
	const attributes = obj.attributes

	$: obj.setId(id)

	store.onValidate = onValidate(obj)

	const updateBind = createBindFunction<T>(store)
	$: updateBind(bind as any)
	
</script>

<slot {store} value={$store || []} attributes={$attributes}/>