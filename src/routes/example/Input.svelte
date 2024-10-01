<script lang='ts'>
	
	import { Value, type ValueProps } from '$lib'
	import type { Snippet } from 'svelte'

	interface Props extends ValueProps {
		children?: Snippet,
		type?: HTMLInputElement['type']
	}
	
	let { children: slot, type, value = $bindable(), ...rest }: Props = $props()

</script>


<Value bind:value {...rest}>
	{#snippet children(prop)}
		<div>
			<label>{@render slot?.()}</label>
			<input disabled={prop.attributes?.disabled} {type} bind:value={prop.value}>
		</div>
	{/snippet}
</Value>


<style>
	
	div {
		display: grid;
		grid-template-rows: auto auto;
		gap: .25rem;
	}

	label {
		padding: 0 .75rem;
		font-size: .8rem;
	}

	input {
		padding: .5rem .75rem;
		border: 1px solid hsl(200, 100%, 50%);
		border-radius: .5rem;
		font-size: 1rem;
	}

	input:focus {
		border: 1px solid hsl(200, 100%, 70%);
		outline: none;
	}
	
</style>