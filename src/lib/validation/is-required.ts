import type { ValidationEvent } from '$lib'

export function isRequired(e: ValidationEvent<number | string>, required?: boolean) {
	if(!required) return

	if (e.value === undefined || e.value === null || e.value === '') {
		e.error('Required')
	}
}