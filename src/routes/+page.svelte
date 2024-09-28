<script lang='ts'>
	
	import * as I from '$lib'
	
	let v = $state({ value: 'some' })

</script>

<I.Object value={v}>
	{#snippet children({ value })}
		{JSON.stringify(value)}
		<I.Prop name='value' value=''>
			{#snippet children(prop)}
				<input bind:value={prop.value}>
			{/snippet}
		</I.Prop>
		<input bind:value={value.value}>
	{/snippet}

</I.Object>

<input bind:value={v.value}>


<style lang='postcss'>
	
	
	
</style>