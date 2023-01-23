<script lang='ts'>
	import { valueStore } from 'svelte-object/value-store'
	import { createBindFunction } from 'svelte-object/utils/component-bind'
	import { svelteObject } from 'svelte-object/utils/svelte-object'
	import type { Bind, RecursivePartial } from 'svelte-object/utils/types'

	type T = $$Generic<Record<any, any>>
	type K = $$Generic

	type P = $$Generic<string>

	/** Initial value (will be prioritized over partial) */
	export let value: T | undefined = undefined
	/** Initial value (value property is prioritized over this) */
	export let partial: RecursivePartial<T> | undefined = undefined
	export const store = valueStore<T>((value || partial || {}) as T)
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