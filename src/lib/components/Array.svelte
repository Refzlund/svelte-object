<script lang='ts'>
	import { createBindFunction } from 'svelte-object/utils/component-bind'
	import { svelteObject } from 'svelte-object/utils/svelte-object'
	import type { Bind } from 'svelte-object/utils/types'
	import valueStoreArray from 'svelte-object/utils/value-store-array'

	type T = $$Generic<Array<any>>
	type K = $$Generic
	type O = $$Generic<Record<String, any>>

	type P = $$Generic<string>

	/** Initial value */
	export let value: T | undefined = undefined
	export const store = valueStoreArray<T>((value || []) as T)
	export let 
		name: string | number | undefined = undefined,
		bind: Bind<T, K> | undefined = undefined,
		attributes: Record<any, any> | undefined = undefined

	store.prechange = v => {
		if(!v)
			return [] as any[] as T
		if(typeof v !== 'object')
			v = $store
		return v
	}
	store.setName(name)

	const obj = svelteObject<O>(store)
	$: obj.$$restProps.set({...$$restProps, ...attributes} as any)

	const updateBind = createBindFunction<T, K>(store)
	$: updateBind(bind)
	
</script>

<slot {store} value={$store || []}/>