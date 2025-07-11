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

	type Prescriptor = {
		name: PropertyKey,
		get: () => unknown,
		set: (value: unknown) => void
	}

	type SvelteObjectGeneric = Record<PropertyKey, unknown> | unknown[]
	type SvelteObjectContext<T extends SvelteObjectGeneric = SvelteObjectGeneric> = {
		addPrescriptor: (
			name: Prescriptor['name'],
			getter: Prescriptor['get'],
			setter: Prescriptor['set']
		) => void
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
	import { getContext, onDestroy, setContext, tick, untrack, type Snippet } from 'svelte'
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

	const prescriptors: Prescriptor[] = $state([])

	$effect.pre(() => {
		for(const prescriptor of prescriptors) {
			let debounced = false
			let debouncer = () => {
				if(debounced) return true
				debounced = true
				tick().then(() => debounced = false)
				return false
			}

			$effect.pre(() => {
				let itemValue = value?.[prescriptor.name]
				// Prevent infinite recursion
				if(debouncer()) return
				
				untrack(() => {
					prescriptor.set(itemValue)
				})
			})
			$effect.pre(() => {
				let itemValue = prescriptor.get()
				prescriptor.name

				// Always allow sending the value to the parent to sustain reactivity
				debouncer()
				untrack(() => {
					value ??= {} as T
					value[prescriptor.name] = itemValue
				})
			})
		}
	})

	const self = {
		addPrescriptor(
			name: PropertyKey,
			getter: () => unknown,
			setter: (value: unknown) => void
		) {
			const prescriptor = { name, get: getter, set: setter }

			value ??= {} as T
			value[prescriptor.name] = getter()

			prescriptors.push(prescriptor)
			return () => {
				prescriptors.splice(prescriptors.indexOf(prescriptor), 1)
			}
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
			parent?.submit()
	}

	if(parent && (name !== undefined && name !== null) && name !== '') {
		parent.addPrescriptor(name, () => value, v => value = v as T)
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