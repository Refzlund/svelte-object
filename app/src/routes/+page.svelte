<script lang='ts'>
	
	import I from 'svelte-object'

</script>

<I.Object>
	{#snippet children({ value: obj })}
		
		<I.Array name='arr'>
			{#snippet children({ value: arr })}
				{#each arr as item, j (item)}
					<I.Object name={j}>
						<div>
							<I.Value name='name' value='Lillemis'>
								{#snippet children(prop)}
									<input bind:value={prop.value}>
								{/snippet}
							</I.Value>
							<I.Value name='age'>
								{#snippet children(prop)}
									<input type='number' bind:value={prop.value}>
								{/snippet}
							</I.Value>
						</div>
					</I.Object>
				{/each}
				<button onclick={() => arr.push({})}>Add item</button>
			{/snippet}
		</I.Array>

		<I.Value name='value' value='fallback'>
			{#snippet children(prop)}
				<input bind:value={prop.value}>
			{/snippet}
		</I.Value>

		<div class='code'>
			{JSON.stringify(obj, null, '    ')}
		</div>
	{/snippet}
</I.Object>


<style>

	:global(body) {
		margin: 10px;
	}
	
	.code {
		background-color: lightgrey;
		width: 100%;
		white-space: pre;
		padding: 8px;

		font-family: monospace !important;
	}
	
</style>