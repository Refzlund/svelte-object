<script lang='ts'>
	
	import { Value, type ValidationEvent, type ValueProps, type ValidationType } from '$lib'
	import type { Snippet } from 'svelte'
	import * as str from '$lib/validation/string'
	import * as num from '$lib/validation/number'
	import { isRequired } from '$lib/validation/is-required'

	interface Props extends ValueProps {
		children?: Snippet,
		type?: HTMLInputElement['type']

		/** Validation */
		min?: number
		max?: number
		required?: boolean
	}
	
	let { 
		value = $bindable(),
		children: slot,
		type, 

		min, max, required,

		...rest
	}: Props = $props()

	let valueComponent: Value<any>
	export const validate = (type: ValidationType = 'force') => valueComponent.validate(type)
	export const submit = () => valueComponent.submit()

	function onValidate(e: ValidationEvent<any>) {
		if(e.trigger.blur) {
			isRequired(e, required)
		}

		num.isMin(e, min, true)
		str.isMin(e, min)

		num.isMax(e, max)
		str.isMax(e, max)
	}

</script>


<Value bind:this={valueComponent} bind:value {...rest} {onValidate}>
	{#snippet children(prop)}
		<div use:prop.blurValidation use:prop.submitOnEnter>
			<label>{@render slot?.()} {#if required}*{/if}</label>
			<input disabled={prop.attributes?.disabled} {type} bind:value={prop.value}>
			{#if prop.error}
				<div class='error'>{prop.error.message}</div>
			{/if}
			{#if prop.warning}
				<div class='warning'>{prop.warning.message}</div>
			{/if}
		</div>
	{/snippet}
</Value>


<style>
	
	div {
		display: grid;
		grid-template-rows: auto auto;
		gap: .25rem;
	}

	.error {
		color: red;
	}
	.warning {
		color: orange;
	}

	label {
		padding: 0 .75rem;
		font-size: .85rem;
	}

	input {
		padding: .5rem .75rem;
		border: 1px solid hsl(200, 100%, 50%);
		border-radius: .5rem;
		font-size: 1rem;
	}

	input:focus {
		outline: none;
		outline: 1px solid hsla(200, 100%, 70%, .75);
	}
	
</style>