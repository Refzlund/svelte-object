<script lang='ts' module>

	export interface Props<T extends Record<PropertyKey, unknown> | unknown[]> {
		children?: Snippet<[{
			value: T
			attributes: Record<PropertyKey, unknown> 
		}]>
		name?: string | number
		value?: T

		/** What the unmodified object is */
		origin?: T
		/** Whether there's a difference between the modified and unmodified */
		modified?: boolean

		attributes?: Record<PropertyKey, unknown>

		onSubmit?: (value: T) => void
	}

	type SvelteObjectGeneric = Record<PropertyKey, unknown> | unknown[]
	type SvelteObjectContext<T extends SvelteObjectGeneric = SvelteObjectGeneric> = {
		setValue(key: string | number, newValue: unknown): void
		addValidator(fn: (trigger?: ValidationType) => boolean): void
		removeValidator(fn: (trigger?: ValidationType) => boolean): void
		submit: () => void
		validate: (trigger?: ValidationType) => boolean
		value: T | undefined
		attributes: Record<string, unknown>
	}

	export function getContextSvelteObject() {
		return getContext('svelte-object') as SvelteObjectContext
	}

</script>

<script lang='ts'>
	import { getContext, onDestroy, setContext, untrack, type Snippet } from 'svelte'
	import deepEqual from 'fast-deep-equal'
	import type { ValidationType } from './validation-types'

	type T = $$Generic<SvelteObjectGeneric>

	let v = $state({}) as T | undefined
	
	let {
		children: slot,
		
		name = '',
		value = $bindable(),

		origin,
		modified = $bindable(false),

		attributes = $bindable({}),

		onSubmit
	}: Props<T> = $props()
	
	v = value
	v ??= {} as T
	
	// svelte-ignore state_referenced_locally
	value = v

	let object = getContext('svelte-object') as typeof self
	
	function createAttributeProxy(): { value: Record<PropertyKey, unknown> } {
		/* eslint-disable-next-line svelte/prefer-writable-derived */
		let target = $state({
			...object?.attributes,
			...attributes 
		})

		let attributeProxy = $derived(new Proxy(target, {
			set(target, key, value) {
				attributes[key] = value
				target[key] = value
				return true
			}
		}))

		$effect.pre(() => {
			target = {
				...object?.attributes,
				...attributes 
			}
		})

		return { 
			get value() { return attributeProxy },
			set value(newValue) { attributes = newValue }
		}
	}

	let attributeProxy = createAttributeProxy()

	let validators = [] as (typeof validate)[]

	const self = {
		setValue(key: string | number, newValue: unknown) {
			if(key === undefined || key === null || key === '')
				return
			value![key as keyof T] = newValue as T[keyof T]
			if(object && name !== '')
				object.setValue(name, value)
		},

		addValidator(fn: typeof validate) {
			validators.push(fn)
		},
		removeValidator(fn: typeof validate) {
			validators = validators.filter(v => v !== fn)
		},

		submit,
		validate,

		get value() { return value },
		set value(newValue) { value = newValue },

		get attributes() { return attributeProxy.value },
		set attributes(newValue) { attributes = newValue }
	} satisfies SvelteObjectContext

	export function submit() {
		if(onSubmit) {
			if(validate('force')) {
				onSubmit(value!)
			}
		}
		else
			object?.submit()
	}

	if(object && (name !== undefined && name !== null) && name !== '') {
		if(object?.value?.[name]) {
			value = object?.value[name] as T
		}
		else {
			object.value![name] = value
		}
	}

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
		if(object?.value) {
			setValue(object.value[name] as T)
		}
	})

	$effect(() => {
		$state.snapshot(value)
		$state.snapshot(origin)
		untrack(() => isModified())
	})

	setContext('svelte-object', self)
	
	/** Validates all values deeply within the object. Returns `true` if `valid` */
	export function validate(trigger: ValidationType = 'force') {
		let valid = true
		for(const fn of validators) {
			let result = fn(trigger)
			if(result === false)
				valid = false
		}
		return valid
	}

	object?.addValidator?.(validate)
	onDestroy(() => object?.removeValidator?.(validate))

</script>

{@render slot?.({ 
	get value() { return value! }, 
	set value(newValue) { value = newValue },
	get attributes() { return self.attributes },
	set attributes(newValue) { self.attributes = newValue }
})}