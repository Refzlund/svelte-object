<script lang='ts'>

	interface Props {
		text?: string
	}
	
	let {
		text = 'Hello World'
	}: Props = $props()

</script>
<!-- ---------------------------------------------- -->


{text}


<!-- ---------------------------------------------- -->
<style lang='postcss'>
	
	

</style>