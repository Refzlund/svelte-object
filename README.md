# Sveltekit Zero Api Forms (szaf)
(currently under development)

Uses [sveltekit-zero-api](https://github.com/Refzlund/sveltekit-zero-api) to mimick SvelteKits official [Form Actions](https://kit.svelte.dev/docs/form-actions).

Additionally comes with utility styling to enhance form capabilities.

### Example
```html
<I.Object let:value let:store GET={id && api.users.id$(id)} POST={api.users}>
	<I.Input type='text' name='name' />
	<I.Input type='number' name='age' />
	<I.Object name='address'>
		<I.Input type='text' name='street' />
		<I.Input type='number' name='zipcode' />
	</I.Object>
	<button on:click={() => console.log({value, store})}>Log</button>
</I.Object>
```
In this example, the form will automatically be populated by an endpoint — if the `id` value is present.

It uses a JSON-like HTML structure, where Object and Array indention is possible. Each field has both a `value` and a `store`. <br>
The store is connected to the value and vice versa, so they always contain the same value.

More information coming later.