<script lang='ts'>
	import { valueStore, Value, type ValueProps } from 'svelte-object'

	type T = string | undefined
	type K = $$Generic
	interface $$Props extends ValueProps<T, K> {
		value?: T
		min?: number
		required?: boolean
	}

	export let value: T = undefined
	export const store = valueStore<T>(value)

	export let 
		required = false,
		min = 0

	/** v for validators */
	const v = {
		required: {
			isInvalid: (value: T) => required && (!value || value.length === 0),
			message: () => `${store.propertyName || 'This input'} is required` as const
		},
		min: {
			isInvalid: (value: T) => min > 0 && (value?.length || 0) !== 0 && (value?.length || 0) < min,
			message: (value: T) => `At least ${min} characters (-${min - (value?.length || 0)})` as const
		}
	} as const

	store.onValidate = ({ trigger: { blur, change }, value, error }) => {
		if(v.required.isInvalid(value))
			return error(v.required.message())

		if(blur) {
			if(v.min.isInvalid(value)) {
				return error(v.min.message(value), v.min.isInvalid, v.min.message)
			}
		}
	}

</script>


<Value
	{store}
	{...$$restProps}
	let:error
	let:attributes
>
	
	<label><slot/><i>  -  {attributes?.test}</i></label>
	<input bind:value={$store} on:blur={() => store.validate('blur')} disabled={attributes?.disabled} />
	{#if error}
		<div style='color: red;'>* {error.message}</div>
	{/if}
</Value>


<style lang='scss'>
	
	
	
</style>