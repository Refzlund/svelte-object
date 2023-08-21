<script lang='ts'>
	
	import I, { bind, type ValueStore } from '../example'
	const t = [{ a: 'yas', b: 123 }] as { a: string, b: number }[]
	
	let store

</script>




<I.Object partial={{}}>
	<I.Text bind:store>A</I.Text>
	<I.Text bind={store}>A</I.Text>
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