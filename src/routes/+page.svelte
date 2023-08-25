<script lang="ts">
	import { onMount } from 'svelte'
	import type { ValueStoreContent } from 'svelte-object'
	import Object from 'svelte-object/components/Object.svelte'
	import I, { bind, type ValueStore } from './example'

	let s: ValueStore<{ 
		test: string
		min: number
		'multi-checkbox': string[]
		checkbox: boolean
		radio: string
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
		disabledArray: boolean
		disableAll: boolean
		contentEditable: string
	}>

	let t: ValueStore<string | undefined>

	let testAttribute = 'This is a test attribute'

	const sleep = async (ms: number) => new Promise(r => setTimeout(r, ms))

	onMount(async () => {
		s.update(v => {
			v.checkbox = true
			v.radio = 'a'
			v.test = 'herp'
			v['nested'] = { ...(v['nested'] || { str:'' }), inside: { deep: '1st' } }
			v['another'] = { nested: { 'some-text': 'A' } }
			return v
		})
		
		await sleep(750)
		
		s.update(v => {
			v.checkbox = false
			v.radio = 'b'
			v['multi-checkbox'] = ['b', 'c']
			v.test = 'derp'
			v.nested.inside.deep = '2nd'
			v.another.nested['some-text'] = 'B'
			return v
		})
		
		await sleep(750)
		
		t.set('slurp')
		s.update(v => {
			v.checkbox = true
			v.radio = 'c'
			v['multi-checkbox'] = []
			v.nested.inside.deep = '3rd'
			v.another.nested['some-text'] = 'C'
			v.nested.str = 'str'
			return v
		})
		testAttribute = 'It is still a test.'
		
		await sleep(2000)
	})

	const clear = () => s.set({} as ValueStoreContent<typeof s>)

	const arrFn = (arr: unknown[]) => {}
</script>

<h1>{$s?.test}</h1>
<div use:bind={[s, s => s.contentEditable]}>This is contenteditable</div>

<I.Text bind={[s, s => s.contentEditable]}>contentEditable</I.Text>

<container>
	
	<I.Text bind={[s, s => s.text]}>Text</I.Text>
	<I.Object bind:store={s} let:store let:value partial={{ 'multi-checkbox': ['a', 'b', 'c'], nested: { str: 'Pre-defined value' } }} test={testAttribute} disabled={$s?.disableAll} >
		<div style='flex-direction: row;'>
			<label for='disableall'>Disable all</label>
			<input id='disableall' type='checkbox' use:bind={[store, s => s.disableAll]} />
		</div>
		<split>
			<div>
				<div>
					<I.Text bind:store={t} name='test'>test</I.Text>
					Input fields with `use:bind`
					<input use:bind={[store, s => s.test]} />
					<input use:bind={t} />
					Components with `bind`
					<I.Text bind={[store, s => s.test]} />
					<I.Text bind={t} />
					<I.Number name='min'>Minimum for the input below</I.Number>
					<I.Number min={value.min} name='num'>Has min</I.Number>
					<h4>Dynamic name</h4>
					<I.Text name='{$t}'>{$t}</I.Text>
					<!-- <h4>Dynamic bind - Does not work.</h4> -->
					<!-- <I.Text bind={[store, s => s[$t || '']]}>bind {$t}</I.Text> -->
				</div>

				<div class="nested">
					<input type='checkbox' use:store={'checkbox'} />
					<input type='radio' use:store={'radio'} value='a' />
					<input type='radio' use:store={'radio'} value='b' />
					<input type='radio' use:store={'radio'} value='c' />
					
					<input type='checkbox' use:store={'multi-checkbox'} value='a' />
					<input type='checkbox' use:store={'multi-checkbox'} value='b' />
					<input type='checkbox' use:store={'multi-checkbox'} value='c' />
					
				</div>

				<div class='nested'>
					<h4>Arrays!</h4>
					<div style='flex-direction: row;'>
						<label for='disabledArray'>Toggle disabled</label>
						<input id='disabledArray' type='checkbox' use:bind={[store, s => s.disabledArray]} />
					</div>
					<I.Array name='array' let:store let:value let:attributes disabled={value.disableAll || value.disabledArray} value={[ { name: 'Lillemis', age: 5 } ]}>
						{arrFn(value)}
						{#each value as item, i}
							<h4>bind</h4>
							<I.Text bind={[store, store => store[i].name]}>{item.name}</I.Text>
							<h4>object</h4>
							<I.Object name='{i}'>
								<I.Text name='name'>Name</I.Text>
								<I.Number name='age'>Age</I.Number>
								<button disabled={attributes.disabled} on:click={() => value.removeByIndex(i)}>Remove {item.name}</button>
							</I.Object> 
						{/each}
						<button disabled={attributes.disabled} on:click={() => value.push({})}>Add item</button>
					</I.Array>
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
			</div>
			<p>
				{JSON.stringify(value, null, '\t')}
				<button on:click={clear}>Clear</button>
			</p>
		</split>
		
		
	</I.Object>

	<div>
		<h4>Input with error on blur (required and minimum 7 characters)</h4>
		<I.Text required min={7}></I.Text>
	</div>

	<div>
		<h4>Disabled recursively</h4>
		<I.Object disabled test='disabled'>
			<I.Text name='name' value='disabled for shur'>Name</I.Text>
			<I.Number name='age'>age</I.Number>
		</I.Object>
	</div>

	<div>
		<I.Object let:store let:value>
			<split>
				<div>
					<h4>Validation test</h4>
					<button on:click={() => console.log('valid:', store.validate())}>Validate inputs</button>
					<I.Text name='required' required>Required</I.Text>
					<I.Text name='min' min={5} value='as'>Min. 5 characters</I.Text>
					<I.Object name='nested'>
						<div class='nested'>
							<I.Text name='min' min={20} value='giraffeisnice'>Min. 20 characters</I.Text>
							<div class='nested'>
								<I.Array name='array' let:value value={[ '', 'short' ]}>
									{#each value as item, i}
										<I.Text name='{i}' required min={7}>Required Min. 7 characters</I.Text>
									{/each}
								</I.Array>
							</div>
						</div>
					</I.Object>
				</div>
				
				<p>
					{JSON.stringify(value, null, '\t')}
				</p>
			</split>
		</I.Object>
	</div>

	<div style='height:100vh;'></div>
	
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
		margin-bottom: 0px;
		&:not(:first-child) {
			margin-top: 10px;
		}
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