# svelte-object
The goal of svelte-object is to create and maintain objects using components. Values are stores, and can therefore be intuitively subscribed to, and updated.

Keep in mind that this library does not provide input- or form components. It provides a framework to create your own components.

It is not limited to inputs and forms. There are many ways you could use this structure to create a responsive and engaging interface.

### Motivation
Components can quickly become bloated with reactive declarations (`$:`). This often causes unforseen bugs.

JSON objects are often duplicated in the script tag to define an object, and the component structure themselves. This requires devs to make changes multiple places and repeat themselves.

FormData objects are no fun to work with. They're not reactive and are mainly limited to forms.

My goals are
- Better developer experience
- Higher dev throughput
- Stores > Reactive components' statements/declarations
- Unified way to relate stores through components and HTML-tags (by using `bind` and `use:bind`)
- Reduce unforseen bugs
- Primary focus on Svelte stores as a reactive data pattern
- Clear and concise component language
- Simplify input validation

### Features
- Allows for nested Objects and Arrays
	- Array stores have `.push` and `.removeByIndex`
- Ease of development for input validation
- Trigger validation methods manually (will be recursive when used on Object or Array)
- 'Rest Params' on Objects and Arrays cascades to children recursively as attributes
- Custom `bind` utility function for components and `use:bind` for HTML-elements
- Type-safe

### Why stores?
There are two big reasons:
1. We cannot bind using `let:directive` - however generalizing the store pattern used in this library, we can!
2. They're both easier and clearer to deal with and to debug
First of call, consider using `Typescript`. If you don't use `Typescript` you may ignore any type-related content that is not pure `Javascript`.

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
			<I.Text name='{i}'> Name </I.Text>
			<button on:click={() => store.removeByIndex(i)}> Remove </button>
		{/each}
		<button on:click={() => store.push('Pet name')}> Add pet </button>
	</I.Array>
</I.Form>
```

## Get Started
First of call, consider using `Typescript`. If you don't use `Typescript` you may ignore any type-related content that is not pure `Javascript`.

### Text.svelte
A simple component for a string could look like this:
```html
<script lang='ts'>
	import { bind, valueStore, Value, type ValueProps } from 'svelte-object'

	// Indicates what type the store contains.
	type T = string | undefined
	
	// Is a required generic type. It types the `bind` function
	// that can be used in relation to the component.
	type K = $$Generic

	// This lists all attributes (props) available to this component. 
	// Notice it extends `ValueProps` which are the properties that 
	// belongs to the headless component "Value"
	interface $$Props extends ValueProps<T, K> {
		/** Initial value */
		value?: T
	}

	export let value: T = undefined
	export const store = valueStore<T>(value)

	// Notice that `const store` is not included in $$Props.
	// This is because we pass the store to the Value-component
	// which takes care of typing that prop.
</script>
```

Next up we create the markup for the `Text` component. This is extremely simple and bare-bone.

If you want to see how to apply store validation and show error message, take a look at [this example](https://github.com/Refzlund/svelte-object/blob/master/src/routes/example/Text.svelte).

```html
<Value
	{store}
	{...$$restProps}
	let:error
	let:attributes
>

	<!-- Way one to bind -->
	<input bind:store={$store}>

	<!-- Way two to bind -->
	<input use:bind={store}>

</Value>
```