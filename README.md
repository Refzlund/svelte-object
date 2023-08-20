<br>
<div align='center'><a href='https://github.com/Refzlund/svelte-object'><img src='https://github.com/Refzlund/svelte-object/blob/master/logo.png' width=500></img></a></div>
<br>

👉   Define objects in your markup-structure!  
💫   Driven by svelte stores for highly robust code  
🔥   Custom `valueStore` to handle (<i>subscribable</i>) error and warning messages

<br>

<div align='center'>Get started with literal wizardry!🧙‍♂️</div>
<div align='center'><code>npm i -D svelte-object</code>  /  <code>pnpm add -D svelte-object</code></div>

<br>
<br>

This could be your code <sup><a href=''>See REPL</a></sup>

```html
<h3> An array of pets </h3>

<Array name='pets' let:value>
	{#each value as item, k}
		<Object name={k}>
			<Input name='name'>Pets name</Input>
			<Input name='age' type='number'>Pets age</Input>
		</Object>
		<button on:click={() => value.removeByIndex(k)}> Remove {item.name} 
	{/each}
	<button on:click={() => value.push({})}> Add pet </button>
</Array>
```

<br>

> [!INFO]  
> And don't forget about all the other features! 

<br>
<br>
<br>
<br>



#### Minimal featured example
[svelte-object](https://github.com/refzlund/svelte-object) makes it easy to bind inputs or your own components, either by `name` or `bind` attribute!

Array has been *proxified* to update its store when using its mutatable function.

See [Svelte REPL](https://svelte.dev/repl/9479243a20784b3ca47e47760bcb35f4?version=4.2.0)

```html
<script lang='ts'>
	import { Object, Array, bind } from 'svelte-object' 
	import InputComponent from './InputComponent.svelte'

	let store
</script>

<Object bind:store>
	<input use:bind={[store, s => s.myInput]} />
	<InputComponent name='myInputComponent' />
	
	<Object name='nested'>
		...
	</Object>
	<Array name='myArray' let:store let:items>
		{#each items as item, k}
			<button on:click={() => store.removeByIndex(k)}>...</button>
			<InputComponent name='{k}' />
		{/each}
		<button on:click={() => store.push(...)}>...</button>
	</Array>
</Object>

<InputComponent bind={[store, s => s.nested.component]}>

$store = {
	myInput: ...,
	myInputComponent: ...,
	nested: {
		component: ...,
		...
	}
}
```

#### Typed `InputComponent.svelte`
Please read [component composition](./component-composition.md) for a detailed explanation.

```html
<script lang='ts'>
	import { bind, valueStore, Value, type ValueProps } from 'svelte-object'

	type T = string | undefined // Your store type
	type K = $$Generic

	interface $$Props extends ValueProps<T, K> {
		/** Initial value */
		value?: T
	}

	export let value: T = undefined
	export const store = valueStore<T>(value)
</script>

<Value
	{store}
	{...$$restProps}
	let:error
	let:warning
	let:attributes
>

	<!-- Bind directly to store -->
	<input bind:store={$store}>

	<!-- Bind using utility function `use:bind` -->
	<input use:bind={store}>

</Value>
```


<br>
<br>
<br>
<br>


## How it works

Components you write<sup><a href='./component-composition.md'>component composition</a></sup> all contains a `valueStore`. They are bound to parents e.g. an `Object` / `Array`. Updates are bidirectional, meaning updating one store may update the other.

<p align='center'><code>valueStore(initialValue: unknown)</code> has </p>

`.setName(name: string)`, which when provided, will bind to the nearest parent object/array through `getContext('svelte-object')`.

`.onValidate(({trigger: { blur, change }, error, warning, value}) => ...)` for custom validation; accepts a callback that returns void, an `error(...)` or `warning(...)`

These are captured in stores, e.g. `.error: Writable<...>`, `.warning: Writable<...>`

`.validate()` will return true or false based on your validation logic.

`.parent` is the parent object/array. These are  reffered to as a "`svelte-object`"

`.parent.attributes: Writable<Record<string, string>>` is a writable of all parents collective (and overriden) attributes. (e.g. `<Object disabled>... </Object>` becomes `$attributes = { disabled: 'true' }`)


<br>
<br>


### Power of `use:bind`
`use:bind` works like `bind:value` — but binds it to a store.

```html

<script>
	import { Object, bind } from 'svelte-object' 
	import InputComponent from './InputComponent.svelte'

	let store
	let inputStore = writable(...)
</script>

<!-- bind directly to a store -->
<input use:bind={inputStore}>

<!-- bind to a store's property -->
<Object bind:store>
	
	<input use:bind={[store, s => s.myInput]} />
	<InputComponent name='myInputComponent' />
	<div use:bind={[store, s => s.contentEditable]}>Using it on a div makes that div contenteditable</div>

</Object>

<InputComponent bind={[store, s => s.outside]}>

$store = {
	myInput: ...,
	myInputComponent: ...,
	contentEditable: ...,
	outside: ...
}

```