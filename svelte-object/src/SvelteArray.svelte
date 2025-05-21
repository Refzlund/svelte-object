<script lang='ts'>
	import type { ObjectProps } from '.'
	import Object from './SvelteObject.svelte'
	import { type Snippet } from 'svelte'

	type T = $$Generic<unknown[]>
	type TItem = T extends Array<infer F> ? F : never

	interface Props extends ObjectProps<T> {
		item?: Snippet<[{ 
			value: TItem
			index: Readonly<number>
			attributes: Record<PropertyKey, unknown>
		}]>
	}

	let objectComponent: Object<T>

	let v = $state([] as unknown[]) as T
	let {
		value = $bindable(),
		
		name = '',
		children: slot,
		item,
		modified = $bindable(false),
		attributes = $bindable({}),
		...rest
	}: Props = $props()

	v = value!
	v ??= [] as unknown[] as T

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

<Object
	bind:this={objectComponent}
	{name}
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
				get value() { return valueItem as TItem },
				set value(newValue) { value![i] = newValue },
				get index() { return i },
				get attributes() { return attributes },
				set attributes(newValue) { attributes = newValue }
			})}
		{/each}
	{/if}
</Object>