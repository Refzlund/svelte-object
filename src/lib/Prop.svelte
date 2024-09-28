<script lang='ts'>
	import { getContext, untrack, type Snippet } from 'svelte'
	
	type T = $$Generic

	interface Props {
		name?: string
		value?: T | undefined | null
		children: Snippet<[{ value: Props['value'] }]>
	}

	let {
		children,
		name = '',
		value = $bindable()
	}: Props = $props()

	const object = getContext('svelte-object') as any

	const setValue = (v: T) => value = v

	if(object && name !== '') {
		const val = object.value[name!]
		if(val !== undefined)
			setValue(val)
	}
	
	$effect(() => {
		object?.value && name !== '' && setValue(object.value[name!])
	})
	$effect.pre(() => {
		value
		untrack(() => object?.setValue(name, value))
	})
	
</script>

{#if children}
	{@render children({ get value() { return value }, set value(newValue) { value = newValue } })}
{/if}