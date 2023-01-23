


### Hierachy

- Object
	- Value
	- Value
	- Array
		- ...{#each} (Value | Object)
	- Object
		- Value
		- Value


```html


<!-- Input/Text.svelte -->
<script lang='ts'>
	import { Value, valueStore, type ValueProps, bind } from 'svelte-object'

	type T = string
	interface $$Props extends ValueProps<T> {}

	export const store = valueStore<T>('Initial value')

	// * ... Other stuff
	// export let min: number = -1


	/**
	 * This code will be run when the value is set or updated.
	 * 
	 * value: T
	*/
	store.prechange = (value) => {
		/** The returned value, is the new set value. */
		return value
	}

	/**
	 * This is a validation function - run when input content needs to be validated
	 * > A parent Object or Array may require validation for all children recursively
	 *
	 * event: ValueValidation<T>
	*/
	store.validate = (event) => {
		const { 
			/**
			 * `error` ((message: string, releaseBehaviour: ReleaseBehaviour) => void, update: ((value: T) => string)), is a function that will tell the validation there's an error
			 * releaseBehaviour: When not to show the error; ('changed' | 'resolved')
			 * 		'changed': When the value is has been modified
			 *		'resolved': When the error shown is corrected/resolved
			 * update: A callback function that updates the error message when the value changes. To give (for instance) reactive feedback.
			*/
			error,
			/** `warning` is the same as `error`, but will tell the validation there's a warning */
			warning,
			/** 
			 * state: ('blur' | 'change' | 'forced'), is a string that tells us why the validate function was called.
			 * 'blur': Element (val) has lost focus within
			 * 'change': The store was updated with new content
			 * 'forced': The validate was called directly
			*/
			state
		} = event
	}

</script>

<Value
	<!-- -->

	{store}
	{...$$restProps}
	
	<!-- error: { message: string, releaseBehaviour: string } -->
	let:error
	<!-- warning: { message: string, releaseBehaviour: string } -->
	let:warning

	<!-- * These are inherited from either Value or its parent(s) -->
	<!-- disabled: boolean -->
	let:disabled
	<!-- loading: (boolean), true if a promise is being awaited -->
	let:loading
>
	<label>
		<slot />
	</label>
	<input type='text' bind:value={$store}>
</Value>
```

