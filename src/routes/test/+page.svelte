<script lang='ts'>
	import { get, writable } from 'svelte/store'

	
	import I, { bind, type ValueStore } from '../example'
	import { onMount } from 'svelte'
	const t = [{ a: 'yas', b: 123 }] as { a: string, b: number }[]
	
	let store
	let nested

	let s = writable()

	onMount(() => {
		// store.subscribe(v => console.log(v))
	})

	/**

	<I.Object id='some-id' let:value>
		<I.Text name='normal' />
		<I.Object id='nested' name='nested' ignore>
			<I.Text name='ignore nested' />
			<I.Text parent='nested' name='parent nested' />
		</I.Object>

		<I.Object bind='some-id'>
			<span>This property parent has `bind="some-id"`</span>
			<I.Text name='ignore nested' /> <!-- Will be the same property as above component -->
		</I.Object>

		<p>{JSON.stringify(value, null, '\t')}</p>
	</I.Object>

	*/

</script>


<div>
	<input use:bind={s} /> {$s}
</div>


	

<div>

	

	<I.Object bind:store let:store test='123'>
		
		<input type='radio' use:store={'k'} value={false}>
		<input type='radio' value='no' use:store={'k'}>
		<input type='radio' value='yes' use:store={'k'}>
		
		<input type='checkbox' use:store={'c'}>
		<input type='checkbox' value='no' use:store={'c'}>
		<input type='checkbox' value='yes' use:store={'c'}>


		<select use:store={'s'}>
			<option value='a'>a</option>
			<option value='b'>b</option>
			<option value='c'>c</option>
			<option value={1}>1</option>
			<option value={2}>2</option>
			<option value={3}>3</option>
		</select>

		<textarea use:store={'t'}>
			Some text
		</textarea>

		<input use:store={'property'} />
		<I.Array let:store let:value name='array'>

			{#each value as item, k}
				<input use:store={k} />
			{/each}
			<button on:click={() => value.push('')}>Add</button>

		</I.Array>

	</I.Object>

	<input use:bind={[store, s => s.array[2]]} />

	<hr>
	<hr>

	<I.Object bind={store} let:store>
		<input use:store={'property'} />
	</I.Object>

</div>

<p>{JSON.stringify($store, null, '\t')}</p>


<style>

	p {
		white-space: pre-wrap;
	}

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