<script lang='ts'>
	
	import I, { bind, type ValueStore } from '../example'
	const t = [{ a: 'yas', b: 123 }] as { a: string, b: number }[]
	
	

</script>




<I.Object partial={{}}>
	<I.Array name='array' let:store let:value value={t}>
		{#each value as item, k}
			<div>
				<I.Object name='{k}'>
					<I.Text name='a'>A</I.Text>
					<I.Text bind={[store, s => s[k].a]}>A</I.Text>
					<I.Number name='b'>B</I.Number>
				</I.Object>
				<button on:click={() => value.removeByIndex(k)}>Remove {item.a}</button>
			</div>
		{/each}
		<button class='add' on:click={() => value.push({})}>Add new</button>
	</I.Array>
</I.Object>


<style>

	div {
		display: flex;
		flex-direction: column;
		gap: 5px;
		width: 200px;
		margin-bottom: 15px;
	}

	.add {
		margin-top: 10px;
	}

</style>