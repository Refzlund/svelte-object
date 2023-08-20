## Component Composition


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

	... Your HTML goes here

</Value>

```

<br>
<br>


### Value.svelte

Your component uses `Value` as a wrapper.

```html
<script>
	// MyInput.svelte 
	import { Value, valueStore } from 'svelte-object'
	
	export const store = valueStore()
</script>

<Value {store} {...$restProps} let:error>
	{#if error}
		...
	<input use:bind={store}>
</Value>
```

```html
<Object>
	<MyInput name='asd' bind={[store, s => s.abc]}>
```

#### `Value` exports
- `store`: valueStore
- `name: string | number | undeifned`
- `bind`: same as use:bind, ex: `bind={[store, s => s.property]}`

#### `Value` let:
- `value={$store}` e.g. valueStore
- `error={$error}` => `store.error`
- `warning={$warning}` => `store.warning`
- `attributes={$attributes}` => `store.parent.attributes`


<br>
<br>


### Types

- `type T`:  The type that should be inside the store

- `type K = $$Generic`:  This is a generic type which is used to type the `bind` function.

- `interface $$Props extends ValueProps<T, K>`: <br>We extend the `ValueProps` interface with `T` and `K`. This types the `name` and `bind` attributes to the component.

<br>

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
```