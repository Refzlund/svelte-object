<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf'

	import Example from './SvelteExample.svelte'

	const { Story } = defineMeta({
		title: 'Svelte/Example',
		component: Example
	})
</script>

<Story name='Default'>
	{#snippet template(args)}
		<Example {...args} />
	{/snippet}
</Story>