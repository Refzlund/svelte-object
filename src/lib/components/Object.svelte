<script lang='ts'>
	import { createObjectStore } from 'svelte-object/utils/object-store'

	import { valueStore, type ValueStore } from '$lib/value-store'
	import { createBindFunction } from '$lib/utils/component-bind'
	import { svelteObject } from '$lib/utils/svelte-object'
	import type { Bind, RecursivePartial } from '$lib/utils/types'
	import onValidate from '$lib/utils/object-onValidate'

	type T = $$Generic<Record<any, any>>
	type K = $$Generic

	type P = $$Generic<string>

	/** Initial value (will be prioritized over partial) */
	export let value: T | undefined = undefined
	/** Initial value (value property is prioritized over this) */
	export let partial: RecursivePartial<T> | undefined = undefined
	export const store = createObjectStore(valueStore<T>((value || partial || {}) as T))
	export let 
		name: string | number | undefined = undefined,
		bind: Bind<T, K> | undefined = undefined,
		id: string | undefined = undefined

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

	$: obj.setId(id)

	store.onValidate = onValidate(obj)

	const updateBind = createBindFunction<T>(store)
	$: updateBind(bind)

</script>

<slot {store} value={$store} attributes={$attributes}/>