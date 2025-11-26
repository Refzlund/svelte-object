<!-- @component

	A wrapper for React components in Svelte.

@example
<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf'

	import React from '../React.svelte'
	import { CounterComposite } from './ReactExample'

	const { Story } = defineMeta({
		title: 'React Example',
		component: React,
		args: {
			$component: CounterComposite,
			label: 'Test',
			// ...props
		}
	})

</script>

<Story name='Default' />

<Story name='Template'>

	{#snippet template()}
		<React $component={CounterComposite} label='Test' ...props />
	{/snippet}

</Story>
-->

<script lang='ts'>
	import { onMount, onDestroy } from 'svelte'
	import { createRoot, type Root } from 'react-dom/client'
	import React, { createElement } from 'react'

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	type TComponentType = $$Generic<React.ComponentType<any>>
	type Props = {
		$component: TComponentType
	} & (TComponentType extends React.ComponentType<infer P> ? P : never)
	
	let {
		$component: component,
		...p
	}: Props = $props()

	// local refs --------------------------------------------------------------
	let container: HTMLDivElement
	let root: Root

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const render = () => root.render(createElement(component as any, p as any))

	onMount(() => {
		root = createRoot(container)
		render()
	})

	// re-render when props change
	$effect(() => {
		if(root) {
			render()
		}
	})

	onDestroy(() => root?.unmount())
</script>

<div bind:this={container}></div>