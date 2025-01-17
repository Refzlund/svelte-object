<script lang='ts'>
	import type { ObjectProps } from '.'
	import Object from './Object.svelte'
	import { type Snippet } from 'svelte'

	type T = $$Generic<any[]>

	interface Props extends ObjectProps<T> {
		item?: Snippet<[{ 
			value: T extends (infer K)[] ? K : any,
			index: Readonly<number>,
			attributes: Record<PropertyKey, any>
		}]>
	}

	let objectComponent: Object<any>

	let v = $state([] as any[]) as T
	let {
		// svelte-ignore state_referenced_locally
		value = $bindable(),
		
		name = '',
		children: slot,
		item,
		modified = $bindable(false),
		attributes = $bindable({}),
		...rest
	}: Props = $props()

	// svelte-ignore state_referenced_locally
	v = value!
	v ??= [] as any[] as T

	// svelte-ignore state_referenced_locally
	value = v

	function push(...v: T[number][]) { 
		return value?.push(...v)
	}
	
	export function validate(...args: Parameters<typeof objectComponent.validate>) {
		objectComponent.validate(...args)
	}
	export function submit(...args: Parameters<typeof objectComponent.submit>) {
		objectComponent.submit(...args)
	}

	export { 
		value as $,
		push
	}

</script>

<Object bind:this={objectComponent} bind:value={value as T} {name} bind:modified bind:attributes {...rest}>
	{@render slot?.({ 
		get value() { return value! }, 
		set value(newValue) { value = newValue },
		get attributes() { return attributes },
		set attributes(newValue) { attributes = newValue }
	})}
	{#if item && Array.isArray(value)}
		{#each value as valueItem, i}
			{@render item?.({ 
				get value() { return valueItem },
				set value(newValue) { value![i] = newValue },
				get index() { return i },
				get attributes() { return attributes },
				set attributes(newValue) { attributes = newValue }
			})}
		{/each}
	{/if}
</Object>