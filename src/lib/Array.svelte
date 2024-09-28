<script lang='ts'>
	import Object from './Object.svelte'
	import { type Snippet } from 'svelte'

	type T = $$Generic<unknown[]>

	interface Props {
		children: Snippet<[{ value: T }]>
		value?: T
		name?: string
	}

	let v = $state([] as any[]) as T
	let {
		// svelte-ignore state_referenced_locally
		value = $bindable(v),
		
		name = '',
		children
	}: Props = $props()

	// svelte-ignore state_referenced_locally
	v = value
	// svelte-ignore state_referenced_locally
	value = v

	function push(...v: T[number][]) { 
		return value.push(...v)
	}
	
	export { 
		value as $,
		push
	}
	
</script>

<Object bind:value={value as any} {name}>
	{#if children}
		{@render children({ get value() { return value }, set value(newValue) { value = newValue } })}
	{/if}
</Object>