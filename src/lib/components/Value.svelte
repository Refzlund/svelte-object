<script lang='ts'>
	import { createBindFunction } from 'svelte-object/utils/component-bind'
	import type { Bind } from 'svelte-object/utils/types'
	import type { ValueStore } from 'svelte-object/value-store'

	type T = $$Generic
	type K = $$Generic
	
	interface $$Props {
		store: ValueStore<T>
		name?: string | number
		bind?: Bind<T, K>
		parent?: string
	}

	export let 
		store: ValueStore<T>,
		name: string | number | undefined = undefined,
		bind: Bind<T, K> | undefined = undefined,
		parent: string | undefined = undefined

	export const validate = store.validate

	$: store.setName(name)
	$: store.setParent(parent)

	const 
		error = store.error,
		warning = store.warning,
		attributes = store.parent?.attributes

	const updateBind = createBindFunction<T>(store)
	$: updateBind(bind)

</script>


<slot {store} value={$store} error={$error} warning={$warning} attributes={$attributes} />
