<script lang='ts' module>
	
	export interface Props<T = unknown> {
		name?: string | number
		value?: T | undefined | null
	}

</script>

<script lang='ts'>
	import { onDestroy, tick, untrack, type Snippet } from 'svelte'
	import type { ValidationEvent, ValidationMessage, ValidationType } from './validation-types'
	import { getContextSvelteObject } from './SvelteObject.svelte'
	
	type T = $$Generic
	
	const object = getContextSvelteObject()

	let {
		children: slot,
		name = '',
		value = $bindable(),
		onValidate
	}: Props<T> & { 
		onValidate?: (validationEvent: ValidationEvent<T>) => void
		children?: Snippet<[props: { 
			value: Props<T>['value']
			blurValidation: (element: HTMLElement) => { destroy: () => void }
			submitOnEnter: (element: HTMLElement) => { destroy: () => void }
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			attributes?: Record<PropertyKey, any>
			error?: | { message: string }
			warning?: | { message: string }
		}]>
	} = $props()

	let error = $state(undefined) as undefined | ValidationMessage<T>
	let warning = $state(undefined) as undefined | ValidationMessage<T>
	class Validated {}
	class Errored {}
	
	let prevValidation = null as boolean | null

	/** Returrns `true` if `valid` */
	export function validate(trigger: ValidationType = 'force') {
		if(prevValidation !== null) return prevValidation
		tick().then(() => prevValidation = null)

		try {
			onValidate?.({
				trigger: { 
					blur: trigger === 'blur' || trigger === 'force', 
					change: trigger === 'change' || trigger === 'force'
				},
				get value() { return value },
				set value(newValue) { value = newValue },
				skip: () => { throw new Validated() },
				error: (m, s, u) => {
					if(error === undefined) {
						warning = undefined
						error = {
							message: m,
							keepMessage: s,
							updateMessage: u 
						}
					}
					throw new Errored()
				},
				warning: (m, s, u) => {
					if(error === undefined)
						warning = {
							message: m,
							keepMessage: s,
							updateMessage: u 
						}
					throw new Validated()
				}
			})
		} catch (error) {
			if(error instanceof Errored) {
				return (prevValidation = false)
			}
			if(error instanceof Validated) {
				return (prevValidation = true)
			}
			throw error
		}
		return (prevValidation = true)
	}

	/** Svelte action. `use:blurValidation` */
	function blurValidation(element: HTMLElement) {
		const fn = () => {
			validate('blur')
		}
		element.addEventListener('focusout', fn)
		return {
			destroy() { element.removeEventListener('focusout', fn) }
		}
	}

	export function submit() {
		object?.submit()
	}

	function submitOnEnter(element: HTMLElement) {
		const fn = (e: KeyboardEvent) => {
			const target = e.target as HTMLInputElement | HTMLTextAreaElement
			if(target.tagName === 'TEXTAREA')
				return
			if(e.key === 'Enter') {
				submit()
				e.preventDefault()
			}
		}
		element.addEventListener('keydown', fn)
		return {
			destroy() { element.removeEventListener('keydown', fn) }
		}
	}

	object?.addValidator(validate)
	onDestroy(() => object?.removeValidator(validate))

	if(object && (name !== undefined && name !== null) && name !== '') {
		object.addPrescriptor(name, () => value, v => value = v as T)
	}
	
	$effect.pre(() => {
		value

		untrack(() => {
			if(!error?.keepMessage?.(value))
				error = undefined
			if(!warning?.keepMessage?.(value))
				warning = undefined
			validate('change')
		})
	})
	
</script>

{@render slot?.({ 
	get value() { return value }, 
	set value(newValue) { value = newValue },
	get attributes() { return object?.attributes },
	get error() { return error },
	get warning() { return warning },
	get blurValidation() { return blurValidation },
	get submitOnEnter() { return submitOnEnter }
})}