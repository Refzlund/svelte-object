<script lang="ts">
	import { getContext, setContext } from 'svelte'
	import type { InputType } from '$lib'
	import { conditionalShow, conditionalTrim, ParentObject } from '$utils/field'
	import LinkedStore from '$utils/linked-store'
	import type { Field } from './types'
	import typeAction from '$utils/type-action'

	// * Two-way binding for store and value
	export let
		/** Name of this input */
		name: string | undefined = undefined,
		/** Text visaully displayed after input text */
		after = '',
		/** Text visaully displayed before input text. 
		 * 
		 * Prepend + to show when in focus
		 * 
		 * Prepend * to show without any value
		*/
		before = '',
		/** The value of the input */
		value: any = undefined,
		/** The input type */
		type: InputType = 'text'

	$: b = conditionalShow(before, value, field.hovered, field.focused)
	$: a = conditionalShow(after, value, field.hovered, field.focused)

	const store = new LinkedStore(value, v => value = v)
	$: store.reactivity(value)
	
	const parent = getContext('parent') as Field | undefined
	ParentObject(parent, store, name)

	const field: Field<'input'> = {
		type: 'input',
		parent,
		store,
		focused: false,
		hovered: false
	}

	let left = 0	
	function beforeAction(node: HTMLElement, b) {
		const update = () => left = parseFloat(getComputedStyle(node, ':before').width)
		update()
		return { update }
	}
	setContext('parent', field)
</script>

<field
	class:value
	class:focused={field.focused}
	class:hovered={field.hovered}
	class:before={b}
	class:after={a}
	on:mouseenter={() => field.hovered = true}
	on:mouseleave={() => field.hovered = false}
>
	<input
		name='{name}'
		{...$$restProps}
		use:typeAction={[store, type]}
		bind:value
		on:focus={() => field.focused = true}
		on:blur={() => field.focused = false}
		style='--left: {left}px'
	/>
	<input-content 
		style='--content-after: "{conditionalTrim(after)}"; --content-before: "{conditionalTrim(before)}";'
		use:beforeAction={b}
	>
		{value || ''}
	</input-content>
</field>

<style lang='scss'>
	field {
		display: inline-flex;
		font-family: Arial, Helvetica, sans-serif !important;
		
		position: relative;
		min-width: 100px;
		height: 24px;
		width: 200px;
		
		&, * {
			font-size: 14px;
		}
	}

	input-content, input {
		font-family: inherit;
		font-size: inherit;
		word-spacing: inherit;
		letter-spacing: inherit;
		border-spacing: inherit;
		padding-inline-start: inherit;
		display: inline-flex;
		align-items: center;
		position: absolute;
		top: 0; left: var(--left, 0px); right: 0; bottom: 0;
		padding: 0px 5px;
		align-self: center;
		white-space: pre;
		border: 0;
		&:focus, &:active {
			outline: 0;
			border: 0;
		}
	}

	input-content {
		color: transparent;
		pointer-events: none;
		user-select: none;
		&::after, &::before {
			color: initial;
			display: inline-flex;
			pointer-events: none;
			user-select: none;
		}
		&::after { content: var(--content-after, ''); }
		&::before { content: var(--content-before, ''); }
	}

	field {
		> input-content::after,
		> input-content::before {
			opacity: 0;
			transform: translate(0px, 3px);
			transition: 
				.175s ease;
		}
		
		&.after > input-content::after,
		&.before > input-content::before {
			opacity: 1;
			transform: translate(0px, 0px);
		}
	}

	field {
		border: 1px solid grey;
		&:hover {
			outline: 1px solid darkgrey;
		}
		&:focus-within {
			outline: 1px solid black;
		}
	}

</style>