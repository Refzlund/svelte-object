import { getContext, onDestroy, onMount, tick } from 'svelte'
import { get, writable, type Updater, type Writable } from 'svelte/store'
import type { SvelteObject } from './utils/svelte-object'

type ValidationTrigger = {
	/** The input has been blurred (not in focus anymore) */
	blur: boolean
	/** The store has been changed (using set or update) */
	change: boolean
}
type ValidationEvent<T> = {
	/** A conditional error message */
	error(
		/** The error message is the message that is affiliated with the error */
		errorMessage: string,
		/** 
		 * `show` is a function that dictates whether the message should show or not.
		 *
		 * It is run when the store updates.
		 *  
		 * Default is `() => false`, so when the user types something, it should vanish (and reappear if the trigger is `change`)
		 * 
		 * You could parse the `isInvalid` function, so ONLY when the error has been fixed - the message will disappear.
		*/
		show?: (value: T) => boolean,
		/**
		 * `update` is a function that updates the errorMessage as the store changes.
		 * 
		 * This can give dynamic information for the input.
		*/
		update?: (value: T) => string): void

	/** A conditional warning message */
	warning(
		/** The warning message is the message that is affiliated with the warning */
		warningMessage: string,
		/**
		 * `show` is a function that dictates whether the message should show or not.
		 *
		 * It is run when the store updates.
		 *  
		 * Default is `() => false`, so when the user types something, it should vanish (and reappear if the trigger is `change`)
		 * 
		 * You could parse the `isInvalid` function, so ONLY when the error has been fixed - the message will disappear.
		*/
		show?: (value: T) => boolean,
		/**
		 * `update` is a function that updates the warningMessage as the store changes.
		 * 
		 * This can give dynamic information for the input.
		*/
		update?: (value: T) => string): void

	/** The value of the store at the time of the trigger */
	value: T

	/** 
	 * Tells us why the validate function was called.
	 * 
	 * `'blur' | 'change' | 'forced'`
	*/
	trigger: ValidationTrigger
}

export type ValueStore<T> = Readonly<{
	subscribe: Writable<T>['subscribe']
	set: Writable<T>['set']
	update(updater?: Updater<T>): void,
	/** Returns `true` if valid */
	validate(trigger?: keyof ValidationTrigger | 'forced', value?: T): boolean
	setName(name: string | number | undefined): void
	name?: string | number 
	error: Writable<undefined | { message: string, show?: (value: T) => boolean, update?: (value: T) => string }>
	warning: Writable<undefined | { message: string, show?: (value: T) => boolean, update?: (value: T) => string }>
	parent?: SvelteObject
}> & {
	prechange?(value: T): T
	onValidate?(event: ValidationEvent<T>): void
}

export type ValueStoreContent<T extends ValueStore<any>> = T extends ValueStore<infer K> ? K : never 

/**
 * @example
 * type T = string
 * interface $$Props extends ValueProps<T> {}
 *
 * export const store = valueStore<T>('Initial value')
*/
export function valueStore<T>(initialValue: T): ValueStore<T> {
	const obj = getContext('svelte-object') as SvelteObject
	const svelteStore = writable<T>(initialValue)

	const store: ValueStore<T> = {
		parent: obj,
		set(value) {
			svelteStore.set(store.prechange ? store.prechange(value) : value)
		},
		update(updater) {
			const value = updater ? updater(get(svelteStore)) : get(svelteStore)
			svelteStore.set(store.prechange ? store.prechange(value) : value)
		},
		subscribe: svelteStore.subscribe,
		name: undefined,
		setName(name) {
			// @ts-expect-error
			store.name = name
			obj?.addValueStore(store)
		},
		validate(trigger = 'forced', value) {
			if (!store.onValidate)
				return true
			const
				forced = trigger === 'forced',
				change = forced || trigger === 'change',
				blur = forced || !change
			store.onValidate({
				trigger: { change, blur },
				value: value || get(store),
				error, warning
			})
			return !!get(store.error)
		},
		error: writable(undefined),
		warning: writable(undefined)
	}

	const error: ValidationEvent<T>['error'] = (message, show, update) => {
		if (get(store.error)) return
		store.error.set({ message, show, update })
	}
	const warning: ValidationEvent<T>['warning'] = (message, show, update) => {
		if (get(store.warning)) return
		store.warning.set({ message, show, update })
	}

	const unsub = store.subscribe(v => {		
		const error = get(store.error)
		const warning = get(store.warning)
		
		if (error) {
			const show = error.show ? error.show(v) : false
			if (show && error.update) {
				store.error.update(err => {
					error.message = error.update?.(v) as string
					return error
				})
			}
			if (!show)
				store.error.set(undefined)
		}
		if (warning) {
			const show = warning.show ? warning.show(v) : false
			if (show && warning.update) {
				store.warning.update(err => {
					warning.message = warning.update?.(v) as string
					return warning
				})
			}
			if (!show)
				store.warning.set(undefined)
		}

		store.validate('change')
	})

	onMount(() => {
		return () => {
			unsub()
			obj?.removeValueStore(store)
		}
	})
	
	return store
}
