<script lang='ts'>
	
	import { valueStore, Value, type ValueProps } from 'svelte-object'

	type T = number | undefined
	type B = $$Generic
	interface $$Props extends ValueProps<T, B> {
		value?: T
		min?: number | undefined
	}

	export let value: T = undefined
	export const store = valueStore(value)
	
	export let min: number | undefined = undefined

	const elements = {
		input: undefined as HTMLInputElement | undefined
	}

	store.prechange = (v) => {
		if(!v) return
		if(min && v < min)
			v = min

		if(elements.input)
			elements.input.value = v.toString()
		return v
	}

	$: store.update(), min

</script>

<Value
	{store}
	{...$$restProps}
	let:attributes
>
	<label><slot/></label>
	<input bind:this={elements.input} type='number' bind:value={$store} disabled={attributes?.disabled} />
</Value>


<style lang='scss'>
	
	
	
</style>