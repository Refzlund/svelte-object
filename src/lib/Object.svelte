<script lang='ts'>
	import { getContext, setContext, untrack, type Snippet } from 'svelte'
	import deepEqual from 'fast-deep-equal'

	type T = $$Generic<Record<PropertyKey, unknown>>

	interface Props {
		children: Snippet<[{ value: T }]>
		name?: string
		value?: T

		/** What the unmodified object is */
		origin?: T
		/** Whether there's a difference between the modified and unmodified */
		modified?: boolean
	}

	let v = $state({}) as T
	
	let {
		children,
		
		name = '',
		// svelte-ignore state_referenced_locally
		value = $bindable(v),

		origin,
		modified = $bindable(false)
	}: Props = $props()
	
	// svelte-ignore state_referenced_locally
	v = value
	// svelte-ignore state_referenced_locally
	value = v

	let object = getContext('svelte-object') as typeof self
	
	const self = {
		setValue(key: string, newValue: any) {
			if(key === undefined || key === null || key === '')
				return
			value![key as keyof T] = newValue
			if(object && name !== '')
				object.setValue(name, value)
		},
		get value() { return value },
		set value(newValue) { value = newValue } 
	}

	if(object && name !== '' && object?.value[name])
		value = object?.value[name] as T
	else if(object && name !== '')
		// @ts-expect-error Annoin'
		object.value[name] = value
	
	let checkingIsModified = false
	function isModified() {
		if(!origin)
			return modified = false
		if(checkingIsModified) return
		checkingIsModified = true
		setTimeout(() => {
			checkingIsModified = false
			modified = !deepEqual($state.snapshot(value), $state.snapshot(origin))
		}, 125)
	}

	const setValue = (v: T) => Object.assign(value, v)
	$effect.pre(() => {
		object?.value && setValue(object.value[name] as T)
	})

	$effect(() => {
		$state.snapshot(value)
		$state.snapshot(origin)
		untrack(() => isModified())
	})

	setContext('svelte-object', self)
	export {
		value as $
	}
</script>

{#if children}
	{@render children({ get value() { return value }, set value(newValue) { value = newValue } })}
{/if}