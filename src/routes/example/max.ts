import type { ValidationEvent } from '$lib'

export function isMax(e: ValidationEvent<number | string>, max?: number) {
	if (max &&
		(
			(typeof e.value === 'number' && e.value > max)
			|| (typeof e.value === 'string' && e.value.length > max)
		)
	) {
		e.error(`Value must be less or equal to ${max}`)
	}
}