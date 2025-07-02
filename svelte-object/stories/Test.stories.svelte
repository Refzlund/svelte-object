<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf'

	import I from '../src/index.svelte'
	import Test from './Test.svelte'
	import InputExample from './InputExample.svelte'

	const { Story } = defineMeta({
		title: 'svelte-object'
	})
</script>

<Story name='Test'>
	{#snippet template()}
		<Test />
	{/snippet}
</Story>

<Story name='Example'>
	{#snippet template()}
		<InputExample />
	{/snippet}
</Story>