<script lang='ts' module>

	export interface Props<T extends Record<PropertyKey, unknown> | unknown[]> {
		children?: Snippet<[props: {
			value: T
			attributes: Record<PropertyKey, unknown> 
		}]>
		name?: string | number
		default?: T
		value?: T

		/**
		 * What the unmodified object is
		 * 
		 * Note: Set it with snapshot and untracked;  
		 * `origin={untrack(() => $state.snapshot(value))}`
		 * 
		 * Alternatively, use `object.setOrigin(value)`.
		*/
		origin?: T
		/** Whether there's a difference between the modified and unmodified */
		modified?: boolean

		attributes?: Record<PropertyKey, unknown>

		onSubmit?: (value: T) => void

		/** Validate with parent, even if unnamed */
		withParent?: boolean
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
		withParent = false,

		default: defaultvalue,
		value = $bindable(),

		origin = $bindable(),
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
			$effect.pre(() => {
				let itemValue = value?.[prescriptor.name]				
				untrack(() => {
					prescriptor.set(itemValue)
				})
			})
			$effect.pre(() => {
				let itemValue = prescriptor.get()
				prescriptor.name

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

			if(value) {
				const current = value[name]
				if(current === undefined || current === null) {
					value[prescriptor.name] = getter()
				}
				else {
					prescriptor.set(current)
				}
			}
			
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

	export function setOrigin(newOrigin: T) {
		untrack(() => origin = $state.snapshot(newOrigin) as any)
	}

	if(parent && (name !== undefined && name !== null) && name !== '') {
		parent.addPrescriptor(name, () => value, v => value = v as T)
	}

	let modificationTimer: ReturnType<typeof setTimeout> | undefined
	function isModified() {
		if(!origin)
			return modified = false
		if(modificationTimer) return
		modificationTimer = setTimeout(() => {
			modificationTimer = undefined
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

	$effect(() => {
		if(withParent || (name !== undefined && name !== null && name !== '') && parent) {
			parent?.addValidator?.(validate)
		}
		else {
			parent?.removeValidator?.(validate)
		}
		return () => parent?.removeValidator?.(validate)
	})

</script>

{@render slot?.({ 
	get value() { return value! }, 
	set value(newValue) { value = newValue },
	get attributes() { return self.attributes },
	set attributes(newValue) { self.attributes = newValue }
})}