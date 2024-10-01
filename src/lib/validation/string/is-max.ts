import type { ValidationEvent } from '$lib'

export function isMax(e: ValidationEvent<string>, max: number | undefined) {
	if (typeof e.value !== 'string' || max === undefined || max === null)
		return
	
	const tooBig = e.value.length > max

	if (!tooBig)
		return
	
	e.error(`Value must be less or equal to ${max}`)
}