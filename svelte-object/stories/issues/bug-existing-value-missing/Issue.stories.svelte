<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf'
	import Issue from './Issue.svelte'

	const { Story } = defineMeta({})
</script>

<Story name='Reproduction'>
	{#snippet template()}
		<Issue />
	{/snippet}
</Story>