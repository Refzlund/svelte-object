export type ValidationEvent<T> = {
	/** What triggered the validation? When force, both will be true */
	trigger: { blur: boolean, change: boolean }
	/** If value is set `e.value = ...` then the value will be transformed */
	value: T | null | undefined
	/** Skip further validation checking */
	skip(): void
	error(
		/** Error message */
		message: string,
		/** Whether the error should be kept when value changes */
		keepError?: (value: T | null | undefined) => boolean,
		/** Update the error message when value changes */
		updateMessage?: (value: T | null | undefined) => string
	): void
	warning(
		/** Warning message */
		message: string,
		/** Whether the error should be kept when value changes */
		keepWarning?: (value: T | null | undefined) => boolean,
		/** Update the error message when value changes */
		updateMessage?: (value: T | null | undefined) => string
	): void
}

export interface ValidationMessage<T> {
	message: string
	/** Whether the error should be kept when value changes */
	keepMessage?: (value: T | null | undefined) => boolean
	/** Update the error message when value changes */
	updateMessage?: (value: T | null | undefined) => string
}

export type ValidationFn = (validationEvent: ValidationEvent<any>) => void

export type ValidationType = keyof ValidationEvent<any>['trigger'] | 'force'