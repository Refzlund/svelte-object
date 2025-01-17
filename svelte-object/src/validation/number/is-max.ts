import type { ValidationEvent } from '../..'

export function isMax(e: ValidationEvent<number>, max: number | undefined, setToMax?: boolean) {
	if (typeof e.value !== 'number' || max === undefined || max === null)
		return
	
	const tooLarge = e.value > max

	if (!tooLarge)
		return

	if (setToMax) {
		e.value = max
		e.warning(`Value must be less than or equal to ${max}`)
	}
	else
		e.error(`Value must be less than or equal to ${max}`)
}