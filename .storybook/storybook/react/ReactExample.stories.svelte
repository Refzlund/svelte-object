<script lang='ts' module>
	import { defineMeta } from '@storybook/addon-svelte-csf'

	import fromReact from '../from-react'
	import { CounterComposite as XCounterComposite } from './ReactExample'

	const CounterComposite = fromReact(XCounterComposite)

	const { Story } = defineMeta({
		title: 'React/Example',
		component: CounterComposite,
		args: {
			label: 'Test'
		}
	})
	
</script>

<Story name='Default' />

<Story name='Template'>
	{#snippet template()}
		<CounterComposite label='Test' />
	{/snippet}
</Story>