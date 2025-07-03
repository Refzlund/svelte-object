<script lang='ts' module>
	import type { ObjectProps } from './index.svelte'

	export interface ArrayProps<T extends unknown[]> extends ObjectProps<T> {
		item?: Snippet<[props: { 
			value: T[number]
			index: Readonly<number>
			attributes: Record<PropertyKey, unknown>
		}]>
	}
</script>

<script lang='ts'>
	
	import Object from './SvelteObject.svelte'
	import { type Snippet } from 'svelte'

	type T = $$Generic<unknown[]>	

	let objectComponent: Object<T>

	let {
		default: defaultvalue,
		value = $bindable(),
		
		name = '',
		children: slot,
		item,
		modified = $bindable(false),
		attributes = $bindable({}),
		...rest
	}: ArrayProps<T> = $props()

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

<Object
	bind:this={objectComponent}
	{name}
	default={defaultvalue as T ?? []}
	bind:value={value as T}
	bind:modified
	bind:attributes
	{...rest}
>
	{@render slot?.({ 
		get value() { return value! }, 
		set value(newValue) { value = newValue },
		get attributes() { return attributes },
		set attributes(newValue) { attributes = newValue }
	})}
	{#if item && Array.isArray(value)}
		{#each value as valueItem, i (typeof valueItem === 'object' ? valueItem : i)}
			{@render item?.({ 
				get value() { return valueItem as T[number] },
				set value(newValue) { value![i] = newValue },
				get index() { return i },
				get attributes() { return attributes },
				set attributes(newValue) { attributes = newValue }
			})}
		{/each}
	{/if}
</Object>