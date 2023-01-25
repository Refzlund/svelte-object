<script lang='ts'>
	import { createBindFunction } from '$lib/utils/component-bind'
	import onValidate from '$lib/utils/object-onValidate'
	import { svelteObject } from '$lib/utils/svelte-object'
	import type { Bind } from '$lib/utils/types'
	import valueStoreArray from '$lib/utils/value-store-array'

	type T = $$Generic<Array<unknown>>
	type K = $$Generic

	type P = $$Generic<string>

	/** Initial value */
	export let value: T | undefined = undefined
	export const store = valueStoreArray<T>((value || []) as T)
	export let 
		name: string | number | undefined = undefined,
		bind: Bind<T, K> | undefined = undefined

	store.prechange = v => {
		if(!v)
			return [] as any[] as T
		if(typeof v !== 'object')
			v = $store
		return v
	}
	store.setName(name)

	const obj = svelteObject(store)
	$: obj.$$restProps.set($$restProps as any)
	const attributes = obj.attributes

	store.onValidate = onValidate(obj)

	const updateBind = createBindFunction<T, K>(store)
	$: updateBind(bind)
	
</script>

<slot {store} value={$store || []} attributes={$attributes}/>