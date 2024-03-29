<script lang='ts'>
	import { createObjectStore } from 'svelte-object/utils/object-store'

	import { valueStore, type ValueStore } from '$lib/value-store'
	import { createBindFunction } from '$lib/utils/component-bind'
	import { svelteObject } from '$lib/utils/svelte-object'
	import type { Bind, RecursivePartial } from '$lib/utils/types'
	import onValidate from '$lib/utils/object-onValidate'
	import { bind as bindUtil } from '$lib/bind'

	type T = $$Generic<Record<any, any>>
	type K = $$Generic

	type P = $$Generic<string>

	/** Initial value (will be prioritized over partial) */
	export let value: T | undefined = undefined
	/** Initial value (value property is prioritized over this) */
	export let partial: RecursivePartial<T> | undefined = undefined
	
	export const store = valueStore(
		(value || partial || {}) as T,
		() => function bindStore(node: Parameters<typeof bindUtil>[0], property: string) {
			return bindUtil(node, [store, s => s[property]])
		}
	)

	export let 
		name: string | number | undefined = undefined,
		bind: Bind<T, K> | undefined = undefined,
		id: string | undefined = undefined,
		ignore: boolean = false

	store.prechange = v => {
		if(!v)
			return {} as T
		if(typeof v !== 'object')
			v = $store
		return v
	}
	store.setName(name)

	const obj = svelteObject(store, ignore)
	$: obj.$$restProps.set($$restProps as any)
	const attributes = obj.attributes

	$: obj.setId(id)

	store.onValidate = onValidate(obj)

	const updateBind = createBindFunction<T>(store)
	$: updateBind(bind)

</script>

<slot {store} value={$store} attributes={$attributes}/>