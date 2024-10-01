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
		let once = true
		/*
			Once:

			When the value changes, it will get validated.
			Because of this, by setting the value to the "min" it will remove the warning.
			To keep the warning, we'll let it display an additional "tick" after the change (which happens immediately).
		*/
		e.warning(`Value must be greater or equal to ${min}`, () => {
			if (once) {
				once = false
				return true
			}
			return false
		})
	}
	else
		e.error(`Value must be greater or equal to ${min}`)
}