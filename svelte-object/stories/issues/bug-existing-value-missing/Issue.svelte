
<script lang='ts'>
	import 'tailwindcss'
	import I from '../../../src/index.svelte'
	import { onMount } from 'svelte'
	
	let value = $state({
		value: 'example',
		nested: {
			value: 'nested example'
		},
		array: [
			'value1',
			'value2'
		]
	})

	let show = $state(false)
	onMount(() => {
		setTimeout(() => show = true, 3000)
	})

</script>
<!-- ---------------------------------------------- -->


<div class='p-4 border border-gray-300 rounded max-w-72 flex flex-col gap-4'>
	<I.Object bind:value>
		{#snippet children(object)}
			{#if show}
			<I.Value name='value'>
				{#snippet children(value)}
					<input class='border rounded px-4 py-2' bind:value={value.value} />
				{/snippet}
			</I.Value>
				<I.Object name='nested'>
					<I.Value name='value'>
						{#snippet children(value)}
							<input class='border rounded px-4 py-2' bind:value={value.value} />
						{/snippet}
					</I.Value>
				</I.Object>
				<I.Array name='array' value={[ 'value' ]}>
					{#snippet children(array)}
						{#each array.value as item, i (i)}
							<input class='border rounded px-4 py-2' bind:value={array.value[i]} />
						{/each}
						<button
							class='border px-2 py-2 bg-sky-500 hover:bg-sky-600 rounded text-white cursor-pointer'
							onclick={() => array.value.push('')}
						>
							Add
						</button>
					{/snippet}
				</I.Array>
				<pre class='whitespace-pre-wrap'><code>{JSON.stringify(object.value, null, '\t')}</code></pre>
			{/if}
		{/snippet}

	</I.Object>
</div>
<button
	class='border px-2 py-2 bg-gray-500 hover:bg-gray-600 w-72 mt-4 rounded text-white cursor-pointer'
	onclick={() => value = {value: '', array: [], nested: {value: ''}}}
>
	Override value
</button>


<!-- ---------------------------------------------- -->
<style lang='postcss'>
	
	

</style>