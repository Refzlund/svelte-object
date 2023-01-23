<script lang='ts'>
	import { valueStore } from 'svelte-object/value-store'
	import { createBindFunction } from 'svelte-object/utils/component-bind'
	import { svelteObject } from 'svelte-object/utils/svelte-object'
	import type { Bind } from 'svelte-object/utils/types'

	type T = $$Generic<Record<any, any>>
	type K = $$Generic

	type P = $$Generic<string>

	/** Initial value */
	export let value: T = {} as T
	export const store = valueStore<T>(value)
	export let 
		name: string | number | undefined = undefined,
		bind: Bind<T, K> | undefined = undefined

	store.prechange = v => {
		if(!v)
			return {} as T
		if(typeof v !== 'object')
			v = $store
		return v
	}
	store.setName(name)

	const obj = svelteObject(store)
	$: obj.$$restProps.set($$restProps as any)
	const attributes = obj.attributes

	const updateBind = createBindFunction<T, K>(store)
	$: updateBind(bind)
	
</script>

<slot {store} value={$store} attributes={$attributes}/>