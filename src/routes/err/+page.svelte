<script lang="ts">
	import { onMount } from 'svelte'
	import type { ValueStoreContent } from 'svelte-object'
	import I, { bind, type ValueStore } from '../example'

	let s: ValueStore<{ 
		test: string
	}>

	let t: ValueStore<string | undefined>

	let testAttribute = 'This is a test attribute'

	const sleep = async (ms: number) => new Promise(r => setTimeout(r, ms))

	onMount(async () => {
		s.update(v => {
			v.test = 'herp'
			return v
		})
		
		await sleep(750)
		
		s.update(v => {
			v.test = 'derp'
			return v
		})
		
		await sleep(750)
		
		t.set('slurp')
		testAttribute = 'It is still a test.'
		
		await sleep(2000)
	})

	const clear = () => s.set({} as ValueStoreContent<typeof s>)
</script>

<h1>{$s?.test}</h1>


<container>
	
	<I.Object bind:store={s} let:store let:value value={{ test:'value' }}>
		<split>
			<div>
				<div>
					<I.Text bind:store={t} name='test'>test</I.Text>
					<!-- <input use:bind={[store, s => s.test]} /> -->
					<!-- <input use:bind={t} /> -->
					<!-- <I.Text bind={[store, s => s.test]} /> -->
					<I.Text bind={t} />
				</div>
			</div>
			<p>
				{JSON.stringify(value, null, '\t')}
				<button on:click={clear}>Clear</button>
			</p>
		</split>
	</I.Object>

	
</container>

<style lang="scss">

	split {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px;
	}

	div {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.nested {
		padding: 10px;
		border: 1px solid grey;
	}

	h4 {
		padding: 0;
		margin: 0;
		margin-bottom: 5px;
	}
	
	container {
		display: flex;
		justify-content: center;
		gap: 10px;
		flex-direction: column;
	}

	p {
		white-space: pre;
	}

</style>