<script lang='ts' module>

	export interface Props<T extends Record<PropertyKey, unknown> | unknown[]> {
		children?: Snippet<[props: {
			value: T
			attributes: Record<PropertyKey, unknown> 
		}]>
		name?: string | number
		default?: T
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

	let {
		children: slot,
		
		name = '',
		default: defaultvalue,
		value = $bindable(),

		origin,
		modified = $bindable(false),

		attributes = $bindable({}),

		onSubmit
	}: Props<T> = $props()
	
	$effect.pre(() => {
		value ??= defaultvalue ?? {} as T
	})

	let parent = getContext('svelte-object') as typeof self
	
	function createAttributeProxy(): { value: Record<PropertyKey, unknown> } {
		/* eslint-disable-next-line svelte/prefer-writable-derived */
		let target = $state({
			...parent?.attributes,
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
				...parent?.attributes,
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
			if(parent && name !== '')
				parent.setValue(name, value)
		},

		addPrescriptors(
			name: PropertyKey,
			getter: () => unknown,
			setter: (value: unknown) => void,
		) {

		},
		
		prescriptors: Record<PropertyKey, { get: () => unknown, set: (value: unknown) => void }> = {},

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
			parent?.submit()
	}

	if(parent && (name !== undefined && name !== null) && name !== '') {
		if(parent?.value?.[name]) {
			value = parent?.value[name] as T
		}
		else {
			parent.value![name] = value
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
		if(parent?.value) {
			setValue(parent.value[name] as T)
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

	parent?.addValidator?.(validate)
	onDestroy(() => parent?.removeValidator?.(validate))

</script>

{@render slot?.({ 
	get value() { return value! }, 
	set value(newValue) { value = newValue },
	get attributes() { return self.attributes },
	set attributes(newValue) { self.attributes = newValue }
})}