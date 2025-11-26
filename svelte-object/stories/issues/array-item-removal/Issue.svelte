<script lang='ts'>
	import 'tailwindcss'
	import I from '../../../src/index.svelte'
</script>
<!-- ---------------------------------------------- -->

<div class='p-4 border border-gray-300 rounded max-w-[600px] flex flex-col gap-4'>
	<I.Object>
		{#snippet children(obj)}
			<I.Array name="items">
				{#snippet children(arr)}
					<button
						class='border px-2 py-2 bg-sky-500 hover:bg-sky-600 rounded text-white cursor-pointer'
						onclick={() => arr.value.push({})}
					>
						Add Item
					</button>
					
					{#each arr.value as item, k}
						<div class='flex gap-2 items-center'>
							<span class='text-gray-500 w-8'>#{k}</span>
							<I.Object name={k}>
								<I.Value name="text">
									{#snippet children(prop)}
										<input
											class='border rounded px-4 py-2 flex-1'
											placeholder="Enter text..."
											bind:value={prop.value}
										/>
									{/snippet}
								</I.Value>
							</I.Object>
							<button
								class='border px-2 py-2 bg-red-500 hover:bg-red-600 rounded text-white cursor-pointer'
								onclick={() => arr.value.splice(k, 1)}
							>
								Remove
							</button>
						</div>
					{/each}
				{/snippet}
			</I.Array>
			
			<div class='border-t pt-4'>
				<p class='text-sm text-gray-500 mb-2'>obj.value:</p>
				<pre class='whitespace-pre-wrap bg-gray-100 p-2 rounded text-sm'><code>{JSON.stringify(obj.value, null, '\t')}</code></pre>
			</div>
		{/snippet}
	</I.Object>
</div>

<!-- ---------------------------------------------- -->
<style lang='postcss'>
	
	

</style>
