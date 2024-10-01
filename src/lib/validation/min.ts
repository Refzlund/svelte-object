import type { ValidationEvent } from '$lib'

import { isMin as stringIsMin } from './string/is-min'
import { isMin as numberIsMin } from './number/is-min'

export function isMin(e: ValidationEvent<any>, min?: number, setToMin?: boolean) {
	stringIsMin(e, min)
	numberIsMin(e, min, setToMin)
}