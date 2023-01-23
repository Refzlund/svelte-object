<script lang="ts">
	import { onMount } from 'svelte'
	import type { ValueStoreContent } from 'svelte-object'
	import I, { bind, type ValueStore } from './example'

	let s: ValueStore<{ 
		test: string
		min: number
		nested: {
			str: string
			inside: {
				deep: string
			}
		}
		another: {
			nested: {
				'some-text': string
			}
		}
	}>

	let t: ValueStore<string | undefined>

	let testAttribute = 'This is a test attribute'

	onMount(() => {
		s.update(v => {
			v.test = 'herp'
			v['nested'] = { inside: { deep: '1st' }, str: '' }
			v['another'] = { nested: { 'some-text': 'A' } }
			return v
		})
		setTimeout(() => {
			s.update(v => {
				v.test = 'derp'
				v.nested.inside.deep = '2nd'
				v.another.nested['some-text'] = 'B'
				return v
			})
			setTimeout(() => {
				t.set('slurp')
				s.update(v => {
					v.nested.inside.deep = '3rd'
					v.another.nested['some-text'] = 'C'
					v.nested.str = 'str'
					return v
				})
				testAttribute = 'It is still a test.'
				setTimeout(() => {
					s.set({} as ValueStoreContent<typeof s>)
				}, 2000)
			}, 750)
		}, 750)
		
	})

</script>

<h1>{$s?.test}</h1>


<container>
	
	<I.Object bind:store={s} let:store let:value  test={testAttribute} >
		<p>
			{JSON.stringify(value, null, '\t')}
		</p>
		<div>
			<I.Text bind:store={t} name='test'>test</I.Text>
			Input fields with `use:bind`
			<input use:bind={[store, s => s.test]} />
			<input use:bind={t} />
			<I.Number name='min'>Minimum for the input below</I.Number>
			<I.Number min={value.min} name='num'>Has min</I.Number>
			<I.Text name='{$t}'>{$t}</I.Text>
		</div>
		
		<div class='nested'>
			<h4>Nested</h4>
			<I.Object name='nested'>
				<I.Text name='str'>str</I.Text>
				<I.Text name='str'>str</I.Text>
			</I.Object>
			<h4>Nested changed test attribute</h4>
			<I.Object name='nested-changed' test='Changed the test attribute'>
				<I.Text name='str'>str</I.Text>
			</I.Object>
		</div>

		<I.Text name='outside' bind={[store, s => s.nested.inside.deep]}>
			Outside of nested (but also inside using bind)
		</I.Text>

		<h4>Nested object using bind</h4>
		<I.Object bind={[store, store => store.another.nested]}>
			<I.Text name='some-text'>Some Text</I.Text>
		</I.Object>
	</I.Object>

	<div>
		<h4>Input with error on blur (required and minimum 7 characters)</h4>
		<I.Text required min={7}></I.Text>
	</div>

	<div>
		<h4>Disabled recursively</h4>
		<I.Object disabled test='disabled'>
			<I.Text name='name'>Name</I.Text>
			<I.Number name='age'>age</I.Number>
		</I.Object>
	</div>
	
</container>

<style lang="scss">

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