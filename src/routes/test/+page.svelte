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

</script>


<div>
	<input use:bind={s} /> {$s}
</div>


<div>
	<I.Object bind:store let:store test='123'>
		<!-- <I.Text bind:store>A</I.Text>
		<I.Text bind={store}>A</I.Text> -->

		<input use:store={'test'} />
		<I.Object let:store bind:store={nested} bind={[store, store => store.nested.deep]}>
			<input use:store={'test'} />
			<I.Text name='some-text'>Some Text</I.Text>
			<p>{JSON.stringify($nested, null, '\t')}</p>
		</I.Object> 
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