<br>
<div align='center'><a href='https://github.com/Refzlund/svelte-object'><img src='https://github.com/Refzlund/svelte-object/blob/master/logo.png' width=500></img></a></div>
<br>

👉   Define objects in your markup-structure!  
💫   Driven by Svelte 5's runes for highly robust code  
🔥   Handles submit events and validation

<br>

<div align='center'>
	<img src='https://upload.wikimedia.org/wikipedia/commons/1/1b/Svelte_Logo.svg' width=20 align='center'>   
	<b>Made for Svelte 5</b>
</div>

<br>

<div align='center'>Get started with literal wizardry!🧙‍♂️</div>
<div align='center'><code>npm i -D svelte-object</code>  /  <code>pnpm add -D svelte-object</code></div>

<br>
<br>

This could be your code <sup><a href='https://svelte.dev/repl/a750718bed5a4a0eac9085b90b1adc3e?version=4.2.0'>See REPL</a></sup>

```html
<h3> An array of pets </h3>

<Array name='pets' let:value>
	{#each value as item, k}
		<Object name={k}>
			<Input name='name'>Pets name</Input>
			<Input name='age' type='number'>Pets age</Input>
		</Object>
		<button on:click={() => value.removeByIndex(k)}> Remove {item.name} </button>
	{/each}
	<button on:click={() => value.push({})}> Add pet </button>
</Array>
```

<br>

> **Note**  
> What are you waiting for? [Get Started](https://github.com/Refzlund/svelte-object/wiki/Basic-Usage)!

<br>
<br>