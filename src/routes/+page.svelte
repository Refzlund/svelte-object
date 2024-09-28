<script lang='ts'>
	
	import * as I from '$lib'
	
	let v = $state({ value: 'some' })

</script>

<I.Object value={v}>
	{#snippet children({ value })}
		{JSON.stringify(value)}
		<I.Prop name='value' value='fallback'>
			{#snippet children(prop)}
				'<input bind:value={prop.value}>'
			{/snippet}
		</I.Prop>
		<input bind:value={value.value}>
	{/snippet}

</I.Object>

<input bind:value={v.value}>

<div contenteditable bind:textContent={v.value}></div>


<style lang='postcss'>
	
	
	
</style>