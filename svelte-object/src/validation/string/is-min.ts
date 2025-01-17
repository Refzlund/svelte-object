import type { ValidationEvent } from '../..'

export function isMin(e: ValidationEvent<string>, min: number | undefined) {
	if (typeof e.value !== 'string' || min === undefined || min === null)
		return
	
	const tooSmall = e.value.length < min && e.value.length !== 0

	if (!tooSmall)
		return
	
	e.error(`Value must be greater than or equal to ${min}`)
}