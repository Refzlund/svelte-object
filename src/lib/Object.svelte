<script lang='ts'>
	import { getContext, setContext, untrack, type Snippet } from 'svelte'
	import deepEqual from 'fast-deep-equal'

	type T = $$Generic<Record<PropertyKey, any>>

	interface Props {
		children?: Snippet<[{ value: T, attributes: Record<PropertyKey, any> }]>
		name?: string | number
		value?: T

		/** What the unmodified object is */
		origin?: T
		/** Whether there's a difference between the modified and unmodified */
		modified?: boolean

		attributes?: Record<PropertyKey, any>
	}

	let v = $state({}) as T | undefined
	
	let {
		children: slot,
		
		name = '',
		// svelte-ignore state_referenced_locally
		value = $bindable(),

		origin,
		modified = $bindable(false),

		attributes = $bindable({})
	}: Props = $props()
	
	// svelte-ignore state_referenced_locally
	v = value
	v ??= {} as T
	
	// svelte-ignore state_referenced_locally
	value = v

	let object = getContext('svelte-object') as typeof self
	
	function createAttributeProxy(): { value: Record<PropertyKey, any> } {
		let target = $state({ ...object?.attributes, ...attributes })

		let attributeProxy = $derived(new Proxy(target, {
			set(target, key, value) {
				attributes[key] = value
				target[key] = value
				return true
			}
		}))

		$effect.pre(() => {
			target = { ...object?.attributes, ...attributes }
		})

		return { 
			get value() { return attributeProxy },
			set value(newValue) { attributes = newValue }
		}
	}

	let attributeProxy = createAttributeProxy()

	const self = {
		setValue(key: string | number, newValue: any) {
			if(key === undefined || key === null || key === '')
				return
			value![key as keyof T] = newValue
			if(object && name !== '')
				object.setValue(name, value)
		},
		get value() { return value },
		set value(newValue) { value = newValue },

		get attributes() { return attributeProxy.value },
		set attributes(newValue) { attributes = newValue },
	}

	if(object && name !== '' && object?.value?.[name])
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

	const setValue = (v: T) => Object.assign(value!, v)
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

{@render slot?.({ 
	get value() { return value! }, 
	set value(newValue) { value = newValue },
	get attributes() { return self.attributes },
	set attributes(newValue) {  self.attributes = newValue }
})}