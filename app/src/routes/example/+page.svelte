<script lang='ts'>
	
	import * as I from '$lib'
	import Input from './Input.svelte'
	
	let obj = $state({ age: 11 }) as any
	let arr = $state(undefined) as any

	let attr = $state({ disabled: false })

	function moveItem(index: number, direction: number) {
		let array = $state.snapshot(arr)

		let other = index + direction
		if(other === -1) other = array.length - 1
		if(other === array.length) other = 0 

		let a = array[index]
		let b = array[other]
		arr[index] = b
		arr[other] = a
	}
</script>

<form>

	<I.Object bind:value={obj} bind:attributes={attr} onSubmit={(v) => { console.log('submitted', $state.snapshot(v)) }}>
		{JSON.stringify(attr)}
		<button onclick={() => attr.disabled = !attr.disabled}>c</button>
		<Input required bind:value={obj.name} min={3}>Name</Input>
		<Input type='number' name='age' min={18}>Age</Input>
		<div class='array'>
			<button onclick={() => arr.push({})}>Add</button>
			<I.Array name='array' bind:value={arr}>
				{#snippet item(prop)}
					<div class='item'>
						<I.Object bind:value={prop.value}>
							<Input name='a' min={2} required>A</Input>
							<Input bind:value={prop.value.a}>A</Input>
							<Input name='b'>B</Input>
						</I.Object>
						<I.Object name={prop.index}>
							<Input name='a'>A</Input>
							<Input name='b'>B</Input>
						</I.Object>
						<button onclick={() => arr.splice(prop.index, 1)}>Remove</button>
						<button onclick={() => moveItem(prop.index, 1)}> 👉🏿 </button>
						<button onclick={() => moveItem(prop.index, -1)}> 👈🏿 </button>
					</div>
				{/snippet}
			</I.Array>
		</div>
	</I.Object>

	

	<code>
		{JSON.stringify(obj, null, '   ')}
	</code>

</form>

{#if arr?.[2]}
	<input bind:value={arr[2].a}>
	<input bind:value={obj.array[2].a}>
{/if}

<style>

	:global(body) {
		margin: 1rem 1.5rem;
	}

	:global(*) {
		font-family: Arial, Helvetica, sans-serif;
	}

	form {
		display: grid;
		grid-auto-flow: row;
		gap: 1rem;
	}

	.array {
		display: grid;
		grid-auto-flow: column;
		gap: 1rem;
	}
	
	.item {
		display: grid;
		grid-auto-flow: row;
		gap: 1rem
	}

	code {
		display: block;
		background-color: hsl(0, 0%, 90%);
		width: 100%;
		white-space: pre;
		padding: 1rem;
		border-radius: 5px;
	}
	
</style>