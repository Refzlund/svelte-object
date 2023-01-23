# svelte-object
The goal of svelte-object is to create and maintain objects using components. Values are stores, and can therefore be intuitively subscribed to, and updated.

Keep in mind that this library does not provide input- or form components. It provides a framework to create your own components.

It is not limited to inputs and forms. There are many ways you could use this structure to create a responsive and engaging interface.

### Motivation
Components can quickly become bloated with reactive declarations (`$:`). JSON objects are often duplicated in the script tag to define an object, and the component structure themselves. FormData objects are no fun to work with.

My goals are
- Better developer experience
- Higher dev throughput
- Stores > Reactive components statements/declarations
- Unified way to relate stores with components and HTML-tags (with `bind` and `use:bind`)
- Reduce unforseen bugs
- Reactive data
- Clear and concise component language

### Features
- Ease of development for input validation
- Trigger validation methods manually (will be recursive when used on Object or Array)
- 'Rest Params' on Objects and Arrays cascades to children recursively
- Custom `bind` utility function for components and `use:directive` for HTML-elements

### Requirements
Understanding [Svelte Stores](https://svelte.dev/tutorial/writable-stores), how to make [custom stores](https://svelte.dev/tutorial/custom-stores) and how to [derive a store](https://svelte.dev/tutorial/derived-stores) will prove to be important assets to maximizing the use of this library.

### Example use case
Making use of [sveltekit-zero-api](https://github.com/refzlund/sveltekit-zero-api). In this example `GET` will fetch data if an `id` is provided. 
Because of svelte-object, the necessary key-value pairs will populate the relevant inputs.

`Form` which uses svelte-object's Object component contains all relevant information to POST and PATCH data. `Form` will also call the `validate()` function on the svelte-object's Object-component store to validate the form inputs.
```html
<I.Form
	POST={api.people.POST}
	GET={id && api.people.$id(id).GET}
	PATCH={id && api.people.$id(id).PATCH}
>
	<I.Text name='name' required> Name </I.Text>
	<I.Number name='age' min={18}> Age </I.Number>

	<I.Object name='address'>
		<I.Text name='city'> City </I.Text>
		<I.Text name='zipcode'> Zipcode </I.Text>
	</I.Object>
	<I.Array name='pets' let:store let:value>
		{#each value as pet, i}
			<I.Text bind={[store, store => store[i]]}> Name </I.Text>
			<button on:click={() => store.removeByIndex(i)}> Remove </button>
		{/each}
		<button on:click={() => store.push('Pet name')}> Add pet </button>
	</I.Array>
</I.Form>
```

## Get Started