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
		update?: (value: T) => string
	): void

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
		update?: (value: T) => string
	): void

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
	propertyName?: string 
	error: Writable<undefined | { message: string, show?: (value: T) => boolean, update?: (value: T) => string }>
	warning: Writable<undefined | { message: string, show?: (value: T) => boolean, update?: (value: T) => string }>
	parent?: SvelteObject
	initialValue?: T
	/** Removes errors/warnings and sets the value to initial value or the parameter value provided to the function */
	reset(value: T): void
	setParent(parent: undefined | string | number | symbol | SvelteObject): void
}> & {
	prechange?(value: T): T
	onValidate?(event: ValidationEvent<T>): void
}

export type ValueStoreFn<T, F extends Function> = ValueStore<T> & F

export type ValueStoreContent<T extends ValueStore<any>> = T extends ValueStore<infer K> ? K : never 

type CallableFunction = () => Function

/**
 * @example
 * type T = string
 * type Bind = $$Generic
 * interface $$Props extends ValueProps<T, Bind> {}
 *
 * export const store = valueStore<T>('Initial value')
*/
export function valueStore<T, C extends CallableFunction | undefined>(
	initialValue: T,
	callableStore?: C
): [C] extends [Function] ? ValueStoreFn<T, ReturnType<C>> : ValueStore<T> {
	let parentObject = getContext('svelte-object') as SvelteObject
	const svelteStore = writable<T>(initialValue)
	
	type Store = [C] extends [Function] ? ValueStoreFn<T, ReturnType<C>> : ValueStore<T>
	let store = (callableStore ? callableStore() : {}) as Store
	
	const storeObject: ValueStore<T> = {
		initialValue,
		parent: parentObject,
		set(value) {
			svelteStore.set(store.prechange ? store.prechange(value) : value)
		},
		update(updater) {
			const value = updater ? updater(get(svelteStore)) : get(svelteStore)
			svelteStore.set(store.prechange ? store.prechange(value) : value)
		},
		reset(value) {
			value ??= initialValue
			store.set(value)
			store.error.set(undefined)
			store.warning.set(undefined)
		},
		subscribe: svelteStore.subscribe,
		propertyName: undefined,
		setParent(parent) {
			parentObject?.removeValueStore(store)
			if (parent === undefined) {
				parentObject = getContext('svelte-object')
				if (parentObject && store.propertyName)
					store.setName(store.propertyName)
				return
			}
			if (typeof parent === 'object') {
				// @ts-expect-error
				store.parent = parent
			}
			else {
				parentObject = getContext(`svelte-object[${parent.toString()}]`)
			}
			if (parentObject && store.propertyName)
				store.setName(store.propertyName)
		},
		setName(name) {
			parentObject?.removeValueStore(store)
			// @ts-expect-error
			store.propertyName = name?.toString()
			parentObject?.addValueStore(store)
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
			return !get(store.error)
		},
		error: writable(undefined),
		warning: writable(undefined)
	}

	for (let key in storeObject)
		store[key] = storeObject[key]

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
			parentObject?.removeValueStore(store)
		}
	})
	
	return store
}
