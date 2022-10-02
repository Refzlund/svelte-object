<script lang="ts">
	import api from '$src/api'
	import I, { type InputType } from 'svorms'
	let type: InputType = 'number'

	let id: string | undefined = undefined
</script>

<h1>This is a test</h1>


<container>
	<I.Object let:value let:update let:submit GET={id && api.users.id$(id)} POST={api.users}>
		<div>
			<I.Input bind:type name='test' after='px' />
			<I.Input type='text' name='name' />
			<I.Input type='number' name='age' />
		</div>
		<div>
			<button on:click={() => console.log(value)}>
				Log(value)
			</button>
			<button on:click={() => {value['test'] = Math.random(); update()}}>
				Random Object Value
			</button>
			<button on:click={() => type = type === 'number' ? 'text' : 'number'}>
				Switch Type
			</button>
			<button on:click={() => id = id ? undefined : 'ye'}>
				{id ? 'Remove ID' : 'Set ID'}
			</button>
			<button on:click={submit}>
				Submit
			</button>
		</div>
		
	</I.Object>
	
	
</container>

<style lang="scss">
	
	container {
		display: flex;
		justify-content: center;
		gap: 10px;
		flex-direction: column;
	}

</style>