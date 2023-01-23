<script lang='ts'>
	import { valueStore } from 'svelte-object/value-store'
	import { createBindFunction } from 'svelte-object/utils/component-bind'
	import { svelteObject } from 'svelte-object/utils/svelte-object'
	import type { Bind } from 'svelte-object/utils/types'

	type T = $$Generic<Record<any, any>>
	type K = $$Generic
	type O = $$Generic<Record<String, any>>

	type P = $$Generic<string>

	export const store = valueStore<T>({} as T)
	export let 
		name: string | number | undefined = undefined,
		bind: Bind<T, K> | undefined = undefined,
		attributes: Record<any, any> | undefined = undefined

	store.prechange = v => {
		if(!v)
			return {} as T
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

<slot {store} value={$store}/>