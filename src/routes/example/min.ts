import type { ValidationEvent } from '$lib'

export function isMin(e: ValidationEvent<number | string>, min: number | undefined, setToMin?: boolean) {
	if(min === undefined || min === null) return
	
	const tooSmall =
		(typeof e.value === 'number' && e.value < min)
		|| (typeof e.value === 'string' && e.value.length < min && e.value.length !== 0)

	if (!tooSmall)
		return

	if (setToMin && typeof e.value === 'number') {
		e.value = min
		e.warning(`Value must be greater or equal to ${min}`)
	}
	else
		e.error(`Value must be greater or equal to ${min}`)
}