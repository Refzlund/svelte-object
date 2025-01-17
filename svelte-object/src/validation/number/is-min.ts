import type { ValidationEvent } from '../..'

export function isMin(e: ValidationEvent<number>, min: number | undefined, setToMin?: boolean) {
	if (typeof e.value !== 'number' || min === undefined || min === null)
		return
	
	const tooSmall = e.value < min

	if (!tooSmall)
		return

	if (setToMin) {
		e.value = min
		e.warning(`Value must be greater than or equal to ${min}`)
	}
	else
		e.error(`Value must be greater tan or equal to ${min}`)
}