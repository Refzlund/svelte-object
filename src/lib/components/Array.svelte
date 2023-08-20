<script lang='ts'>
	import { createBindFunction } from '$lib/utils/component-bind'
	import onValidate from '$lib/utils/object-onValidate'
	import { svelteObject } from '$lib/utils/svelte-object'
	import type { Bind, InferArray } from '$lib/utils/types'
	import valueStoreArray from '$lib/utils/value-store-array'

	type T = $$Generic<Array<unknown>>
	type O = InferArray<T>
	type SvelteArray<T extends unknown> = T[] & { 
		/** Returns the item that has been removed */
		removeByIndex(i: number): T
		push(item: Partial<T>): number
	}
	type K = $$Generic
	type P = $$Generic<string>

	
	const proxiedArray = Symbol('svelte-array')
	function proxyUpdate(v: SvelteArray<O>, ...keys: string[]) {
		if(!v || v[proxiedArray])
			return v as SvelteArray<O>
		v[proxiedArray] = true
		v.removeByIndex = (index: number) => store.removeByIndex(index) as InferArray<T>
		for(const key of keys) {
			const fn = v[key]
			v[key] = function(...args: unknown[]) {
				const result = fn.call(v, ...args)
				store.update()
				return result
			}
		}
		return v as SvelteArray<O>
	}

	function proxify (v: SvelteArray<O> | undefined | T | never[]) {
		return proxyUpdate(
			v as SvelteArray<O>, 
			'push', 'pop', 'shift', 'unshift', 'splice', 'reverse', 'sort', 'fill', 'copyWithin', 'flat'
		)
	}


	/** Initial value */
	export let value: T | undefined = undefined
	export const store = valueStoreArray<SvelteArray<O>>(proxify(value || []))
	export let 
		name: string | number | undefined = undefined,
		bind: Bind<SvelteArray<O>, K> | undefined = undefined


	store.prechange = v => {
		if(!v) {
			let arr = [] as unknown[] as SvelteArray<O>
			proxify(arr)
			return arr
		}
		if(typeof v !== 'object')
			v = $store

		proxify(v)
		return v
	}
	store.setName(name)

	const obj = svelteObject(store as any)
	$: obj.$$restProps.set($$restProps as any)
	const attributes = obj.attributes

	store.onValidate = onValidate(obj)

	const updateBind = createBindFunction<T, K>(store)
	$: updateBind(bind as any)
	
</script>

<slot {store} value={$store || []} attributes={$attributes}/>